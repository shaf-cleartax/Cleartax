#!/usr/bin/env python3
"""
Screenshot helper for QA-verifying Cleartax website builds in headless Chrome.

Launches its own throwaway headless Chrome instance (fresh profile, random
free debug port), navigates, optionally scrolls, captures a PNG, then tears
the instance down. No manual Chrome lifecycle management needed.

Usage:
  python3 screenshot.py --url "file:///abs/path/index.html" --out /tmp/hero.png
  python3 screenshot.py --url "file:///abs/path/index.html" --out /tmp/mid.png --scroll 2400
  python3 screenshot.py --url "http://localhost:8000/index.html" --out /tmp/mobile.png --mobile

Always test BOTH a plain file:// open (how most people will actually open a
delivered HTML file) and, if useful, a localhost-served open. Some bugs
(ES-module scripts, relative-path fetches) only break under file://.

Requires: pip install --user websocket-client
"""
import argparse
import base64
import json
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.request

try:
    import websocket
except ImportError:
    sys.exit(
        "Missing dependency: websocket-client\n"
        "Install it with: pip install --user websocket-client"
    )

CHROME_PATHS = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
]


def find_chrome():
    env_path = os.environ.get("CHROME_PATH")
    if env_path and os.path.exists(env_path):
        return env_path
    for path in CHROME_PATHS:
        if os.path.exists(path):
            return path
    sys.exit(
        "Could not find a Chrome/Chromium binary in the usual locations.\n"
        "Set CHROME_PATH to the binary's absolute path and retry."
    )


def free_port():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


def wait_for_cdp(port, timeout=10):
    deadline = time.time() + timeout
    last_err = None
    while time.time() < deadline:
        try:
            urllib.request.urlopen(f"http://localhost:{port}/json/version", timeout=0.5)
            return
        except Exception as e:
            last_err = e
            time.sleep(0.2)
    sys.exit(f"Chrome never became ready on port {port}: {last_err}")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--url", required=True, help="URL to load (file:// or http://)")
    ap.add_argument("--out", required=True, help="Path to write the PNG screenshot to")
    ap.add_argument("--scroll", type=int, default=0, help="scrollY position before capture")
    ap.add_argument("--wait", type=float, default=2.5, help="seconds to let JS/animations settle after navigation")
    ap.add_argument("--width", type=int, default=1440)
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--mobile", action="store_true", help="emulate a 390x844 mobile viewport (overrides --width/--height)")
    args = ap.parse_args()

    chrome = find_chrome()
    port = free_port()
    profile_dir = tempfile.mkdtemp(prefix="ct-website-skill-chrome-")

    if args.mobile:
        width, height, mobile, dsf = 390, 844, True, 2
    else:
        width, height, mobile, dsf = args.width, args.height, False, 1

    proc = subprocess.Popen(
        [
            chrome,
            "--headless=new",
            "--disable-gpu",
            f"--remote-debugging-port={port}",
            "--remote-allow-origins=*",
            f"--window-size={width},{height}",
            f"--user-data-dir={profile_dir}",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    ws = None
    try:
        wait_for_cdp(port)
        tabs = json.loads(urllib.request.urlopen(f"http://localhost:{port}/json").read())
        pages = [t for t in tabs if t.get("type") == "page"]
        if not pages:
            sys.exit("No page target found in Chrome's CDP target list.")
        ws = websocket.create_connection(pages[0]["webSocketDebuggerUrl"], timeout=10)

        msg_id = 0

        def send(method, params=None):
            nonlocal msg_id
            msg_id += 1
            ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
            while True:
                resp = json.loads(ws.recv())
                if resp.get("id") == msg_id:
                    return resp

        send("Page.enable")
        send("Runtime.enable")
        send(
            "Emulation.setDeviceMetricsOverride",
            {"width": width, "height": height, "deviceScaleFactor": dsf, "mobile": mobile},
        )
        send("Page.navigate", {"url": args.url})
        time.sleep(max(args.wait, 1.5))

        if args.scroll:
            send("Runtime.evaluate", {"expression": f"window.scrollTo(0, {args.scroll})"})
            time.sleep(min(args.wait, 1.5))

        shot = send("Page.captureScreenshot", {"format": "png"})
        data = base64.b64decode(shot["result"]["data"])
        with open(args.out, "wb") as f:
            f.write(data)
        print(f"saved {args.out} ({len(data)} bytes)")
    finally:
        if ws is not None:
            try:
                ws.close()
            except Exception:
                pass
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()
        shutil.rmtree(profile_dir, ignore_errors=True)


if __name__ == "__main__":
    main()
