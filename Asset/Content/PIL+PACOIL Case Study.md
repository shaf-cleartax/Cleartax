# How PIL and PACOIL met Malaysia's e-Invoicing mandate across 2 entities in just 10 Days

Two SAP entities live on LHDN's MyInvois in a single compliant flow, with zero major production issues.

| INDUSTRY Manufacturing | LOCATION Malaysia |
| :---- | :---- |
| **ANNUAL INVOICES** **41,000 (B2B and B2C)** | **ERP SYSTEM** **SAP ECC** |

**Background**

PIL (Pacific International Lines) and PACOIL are two leading names in Malaysia's manufacturing sector. Between them they run a high-volume invoicing operation on a shared SAP ECC system, raising around 41,000 invoices a year across both business and consumer sales.

In 2024, Malaysia's Inland Revenue Board, LHDN, began rolling out mandatory e-invoicing. Under the Income Tax Act 1967, every business transaction now has to clear the MyInvois platform before it counts as a valid e-invoice. The rollout is phased by annual turnover, and each e-invoice is validated in real time before it can be issued.

Meeting a brand new requirement across two entities, on a fixed timeline, is where the challenge began. This is the story of how PIL and PACOIL met that mandate with Cleartax, on their existing SAP setup and on the timeline they had set.

**What was the requirement?**

The core need was simple to state and hard to deliver. Every invoice raised in SAP ECC had to be turned into a compliant e-invoice, validated by LHDN, and reported correctly, for both PIL and PACOIL. At this volume there was no room for manual workarounds, so the process had to be clean and consistent from the first day.

Several issues sat underneath that. PIL and PACOIL used different General Ledger posting structures, so there was no single way to build and report invoices across the two entities. Employee reimbursement data did not fit the format LHDN required, and tax codes were not always passed through the ledger, which meant gaps had to be filled by hand. On top of that, SAP ECC, the Cleartax platform and the LHDN server all had to exchange data reliably, which called for proper API development rather than an off-the-shelf connector.

**The consequences of getting it wrong**

| Penalties, per offence A missing or non-compliant e-invoice draws a fine of RM200 to RM20,000 per offence under the Income Tax Act 1967\. Across two entities, that adds up fast. | Manual work with no let-up Every tax code gap and mismatched posting would have to be fixed by hand, invoice after invoice, slowing the whole process. |
| :---- | :---- |
| **A window that does not wait** Errors have to be corrected inside LHDN's 72-hour window. Catch them late and the chance to put them right has already passed. | **Standardisation stalled** With two ledgers out of step, PIL and PACOIL could not build one repeatable process that would scale. |

**How Cleartax helped**

Cleartax took an end-to-end approach rather than force the business into a fixed template. The team built a bespoke B2B consolidation feature for the group's specific needs, and developed the API integration between SAP ECC, the Cleartax platform and the LHDN servers from scratch, so data moved cleanly the whole way through.

E-Invoices were generated in SAP standard formats to keep the output compatible and compliant, and Cleartax worked directly with LHDN on use-case-specific questions so the group's particular requirements were cleared without delay. Throughout, a dedicated team of two SAP SD specialists and two programme managers ran the project, with proactive support available around the clock. The result was a single, reliable flow from SAP to LHDN and back, shown below.

| Invoices are raised in SAP ECC across PIL and PACOIL |
| :---: |

**↓**

| Cleartax applies custom logic, including B2B consolidation and tax code handling |
| :---: |

**↓**

| Compliant e-invoices are sent to LHDN MyInvois through a purpose-built API |
| :---: |

**↓**

| MyInvois validates each e-invoice in real time and returns a Unique Identifier Number and QR code |
| :---: |

**↓**

| The cleared e-invoice flows back to SAP and to the buyer |
| :---: |

**The outcome**

The delivery was fast and clean. By testing on a development environment first, user acceptance testing was completed in just two to three days. PIL and PACOIL then achieved a live connection with the LHDN e-invoicing portal within ten days, ahead of the original schedule, which set up a trouble-free production rollout with no major issues.

Beyond speed, the group now has a process that holds. GL postings were standardised across both entities, tax codes and employee reimbursements are handled automatically, and 41,000 e-invoices a year run through one compliant flow. Manual effort dropped, and the team gained a repeatable way of working that is ready to scale.

| 10 days to a live integration | 2 to 3 days to close UAT | 0 major production issues | 2 entities on a single standard |
| :---: | :---: | :---: | :---: |

**What came with Cleartax**

The decision came down to the team standing behind the work, and everything that came with it.

| Dedicated team Two SAP SD specialists and two programme managers assigned to the project. | Support around the clock Proactive help 24/7, with daily status cadences and on-site presence. | Built to fit A bespoke B2B consolidation feature and an API integration built from scratch for SAP ECC. |
| :---- | :---- | :---- |
| **Direct LHDN collaboration** Cleartax worked directly with LHDN to clear use-case-specific questions without delay. | **Proven expertise** An MDEC-accredited provider that has delivered e-invoicing across markets and mandate phases. | **Future ready** Knows how a mandate moves through its phases, so the setup is prepared for what comes next. |

*We have managed to get some customised solutions from ClearTax. They are specifically tailored to our requirements. It has been a good journey, and I must say we selected the right partner, so we are comfortable with ClearTax.*

*Their service, their support, and their ability to understand our requirements are the things that distinguish them from others. My team is very happy with the ClearTax team.*

For PIL and PACOIL, this was never only about meeting a deadline. It was about putting a compliant, repeatable process in place that would hold as volumes grow and the mandate evolves. Cleartax delivered that on the existing team, on SAP, and on the timeline that was set, and stayed close through go-live and beyond.

| Planning your LHDN e-invoicing compliance journey? Partner with Cleartax to build a future-ready compliance framework and get the expert guidance, reliable delivery and continuous support you need. Book a demo now  |
| ----- |

