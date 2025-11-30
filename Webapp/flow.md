# BNI Fleksi Loan Origination Flow

This document explains the end-to-end flow based on the loan origination flowchart and the Jira TLR list. Each step is mapped to an **Issue Key (TLR-xx)** with a short business explanation.

## 1. Lead & Sales Initiation

This phase covers how customer leads enter the system and how Sales performs initial data entry and document submission.

| No | Issue Key | Step Title | Main Role | Short Explanation |
|----|-----------|------------|-----------|--------------------|
| 1 | TLR-26 | Dataleads | Sales / Frontliner | Capture and manage incoming customer leads as the starting point of the journey. |
| 2 | TLR-24 | Database PKS | System / Related Officer | Database PKS step in stage Initiation. |
| 3 | TLR-21 | Simulation BNI Fleksi Aktif (BFA) | System / Related Officer | Simulation BNI Fleksi Aktif (BFA) step in stage Initiation. |
| 4 | TLR-3 | Worklist - Sales | Sales / Frontliner | Route initiated applications into the Sales worklist queue. |
| 5 | TLR-2 | Initial Data Entry - Sales | Sales / Frontliner | Sales inputs initial customer and application data into the system. |
| 6 | TLR-31 | Enhanced Due Diligence (EDD) - Sales | Sales / Frontliner | Perform EDD for flagged or high-risk customers at Sales stage. |
| 7 | TLR-32 | Upload Other Document Submission - Sales | Sales / Frontliner | Sales uploads supporting documents required for analysis. |
| 8 | TLR-33 | Sendback Action - Sales | Sales / Frontliner | Handle corrections from sendback requests back to Sales. |
| 9 | TLR-14 | Set Link Confirmation Submission | System / Related Officer | Send confirmation link to applicant to confirm submission. |

## 2. Internal Checking (ICR Preparation)

In this phase, the system and ICR team perform internal checks such as deduplication, AML, and blacklist screening before moving forward.

| No | Issue Key | Step Title | Main Role | Short Explanation |
|----|-----------|------------|-----------|--------------------|
| 10 | TLR-6 | Central Deduplication | System / Related Officer | Check if customer already exists to avoid duplicate records. |
| 11 | TLR-4 | AML Checking | System / Related Officer | Perform Anti Money Laundering checks on customer data. |
| 12 | TLR-1 | DHN (National Blacklist) Checking | System / Related Officer | Screen customer against national blacklist (DHN). |
| 13 | TLR-41 | Worklist - ICR | Internal Check Reviewer (ICR) | Worklist - ICR step in stage Initiation. |
| 14 | TLR-28 | Internal Check Review (ICR) - Central Deduplication and DHN Checking | Internal Check Reviewer (ICR) | ICR officer reviews internal checking results and decides whether to proceed. |

## 3. External Checking & ICR Result

Here the system validates customer identity and credit history using external data sources (Dukcapil, NPWP, SLIK, etc.) and ICR review.

| No | Issue Key | Step Title | Main Role | Short Explanation |
|----|-----------|------------|-----------|--------------------|
| 15 | TLR-17 | Dukcapil Checking | System / Related Officer | Validate customer identity data using external sources (Dukcapil/NPWP/NIK). |
| 16 | TLR-11 | NPWP Checking | System / Related Officer | Validate customer identity data using external sources (Dukcapil/NPWP/NIK). |
| 17 | TLR-23 | Internal Check Review (ICR) - NPWP Checking | Internal Check Reviewer (ICR) | Internal Check Review (ICR) - NPWP Checking step in stage Initiation. |
| 18 | TLR-25 | SLIK Aggregation | System / Related Officer | Aggregate SLIK credit information from external sources. |
| 19 | TLR-30 | SLIK Deduplication and Checking | System / Related Officer | Perform SLIK credit checking and deduplication for the applicant. |
| 20 | TLR-34 | SLIK Rules | System / Related Officer | Apply SLIK policy rules to the credit history results. |
| 21 | TLR-29 | Internal Check Review (ICR) - SLIK Checking Deduplication | Internal Check Reviewer (ICR) | ICR officer reviews internal checking results and decides whether to proceed. |

## 4. Supervisor Sales Review & EDD Distribution

Sales Supervisor reviews submissions, decides on EDD requirements, and may send back applications for correction.

| No | Issue Key | Step Title | Main Role | Short Explanation |
|----|-----------|------------|-----------|--------------------|
| 22 | TLR-12 | Worklist - Supervisor Sales | Sales Supervisor | Worklist - Supervisor Sales step in stage Initiation. |
| 23 | TLR-27 | Submission Review - Supervisor Sales | Sales Supervisor | Supervisor validates sales submission completeness and eligibility. |
| 24 | TLR-35 | Distribution Enhanced Due Diligence (EDD) - Supervisor Sales | Sales Supervisor | Supervisor distributes applications that require Enhanced Due Diligence. |
| 25 | TLR-36 | Sendback - Supervisor Sales | Sales Supervisor | Sendback - Supervisor Sales step in stage Initiation. |

## 5. Verification & Risk / Limit Assessment

Credit Analyst verifies the information, applies policy rules, calculates limits, and interacts with scoring engines.

| No | Issue Key | Step Title | Main Role | Short Explanation |
|----|-----------|------------|-----------|--------------------|
| 26 | TLR-53 | Auto Assign | System / Related Officer | System automatically assigns applications to the next available analyst. |
| 27 | TLR-54 | Get Next Work | System / Related Officer | Pull next eligible application from the verification queue. |
| 28 | TLR-43 | Worklist - Credit Analyst | Credit Analyst | Display list of applications assigned to the credit analyst. |
| 29 | TLR-70 | Sendback Action - Credit Analyst | Credit Analyst | Sendback Action - Credit Analyst step in stage Verification. |
| 30 | TLR-40 | Verification Strategy | Credit Analyst | Define which verification steps (phone, site, document) are required. |
| 31 | TLR-57 | Verification Process | Credit Analyst | Execute the required verification activities. |
| 32 | TLR-52 | Verification Result - Credit Analyst | Credit Analyst | Record consolidated verification result for the analyst. |
| 33 | TLR-39 | Document Verification - Income Calculation | Credit Analyst | Calculate and verify customer income based on uploaded documents. |
| 34 | TLR-37 | Term of Business Checking | Credit Analyst | Check customer against product Terms of Business (TOB) rules. |
| 35 | TLR-44 | Limit Calculation | Credit Analyst | Calculate preliminary credit limit and tenor based on policy. |
| 36 | TLR-51 | Limit Adjustment and Credit Structure | Credit Analyst | Adjust credit limit and structure according to analysis and policy. |
| 37 | TLR-38 | Credit Scoring Integration | System / Related Officer | Call external/internal scoring engine and store score. |

## 6. Approval Decision

Approver reviews the analysis and issues final credit decisions, including sendback when clarification is required.

| No | Issue Key | Step Title | Main Role | Short Explanation |
|----|-----------|------------|-----------|--------------------|
| 38 | TLR-68 | Tiering Credit Approval | Approver | Determine approval level required based on limit, risk tier, and policy. |
| 39 | TLR-50 | Worklist - Approval | Approver | Queue applications for approver review. |
| 40 | TLR-42 | Credit Approval | Approver | Approver reviews analysis and issues approve/reject/sendback decision. |
| 41 | TLR-56 | Sendback - Approval | Approver | Sendback - Approval step in stage Approval. |

## 7. Contracting, Insurance & Disbursement

After approval, the Credit Operation team manages insurance, SKK/PK documents, and the final disbursement to the customer.

| No | Issue Key | Step Title | Main Role | Short Explanation |
|----|-----------|------------|-----------|--------------------|
| 42 | TLR-5 | Worklist - Credit Operation Officer | Credit Operation Officer | Show pending post-approval cases that need operational processing. |
| 43 | TLR-71 | Sendback Action - Credit Operation Officer | Credit Operation Officer | Sendback Action - Credit Operation Officer step in stage Administration. |
| 44 | TLR-45 | Sendback - Credit Operation Officer | Credit Operation Officer | Sendback - Credit Operation Officer step in stage Administration. |
| 45 | TLR-16 | Generate & Send Order Letter (Insurance) | Insurance / Third Party | Issue insurance order letter for the approved facility. |
| 46 | TLR-10 | Review Kelengkapan Data & Syarat Kredit SKK | Credit Operation / Sales | Check completeness of data & requirements before generating SKK. |
| 47 | TLR-9 | Get link SKK Confirmation Bisnis (under 500 million rupiah) | Credit Operation / Sales | Get link SKK Confirmation Bisnis (under 500 million rupiah) step in stage Administration. |
| 48 | TLR-13 | Get link SKK Confirmation COP (above 500 million) | Credit Operation / Sales | Get link SKK Confirmation COP (above 500 million) step in stage Administration. |
| 49 | TLR-8 | Generate SKK (Offering Letter) | Credit Operation / Sales | Generate SKK (offering letter) for customer confirmation. |
| 50 | TLR-15 | Auto Cancel SKK Expired | System / Related Officer | Automatically cancel SKK when it passes expiry date. |
| 51 | TLR-7 | Worklist - Credit Operation Team Leader | Credit Operation Team Leader | Team leader oversees and reviews credit operation tasks. |
| 52 | TLR-46 | Sendback - Credit Operation Team Leader | Credit Operation Team Leader | Sendback - Credit Operation Team Leader step in stage Administration. |
| 53 | TLR-47 | Review Kelengkapan Data & Syarat Kredit PK (Review Data & Requirement for Loan Agreement) | Credit Operation Team Leader | Review PK (loan agreement) data & requirements before signing. |
| 54 | TLR-18 | Generate PK (Agreement) | Credit Operation Team Leader | Generate loan agreement (PK) documents for signing. |
| 55 | TLR-58 | Pre Disbursement | Credit Operation Officer | Perform final checks before disbursing the loan. |
| 56 | TLR-20 | Generate File CEMTEX (Text File) | Credit Operation Officer | Generate CEMTEX text file for core banking / disbursement system. |
| 57 | TLR-19 | Disbursement (Credit Operation Officer) | Credit Operation Officer | Execute loan disbursement to customer account. |
| 58 | TLR-49 | Disbursement (Team Leader) | Credit Operation Team Leader | Disbursement (Team Leader) step in stage Administration. |

## 8. General & Supporting Services

These are supporting modules (login, parameter maintenance, DMS, reporting, etc.) that enable the main flow.

| No | Issue Key | Step Title | Main Role | Short Explanation |
|----|-----------|------------|-----------|--------------------|
| 59 | TLR-59 | Login | System / Admin | Provide secure login for users into the LOS system. |
| 60 | TLR-64 | Time Setting and Calculation | System / Related Officer | Maintain system date/time and calculation baseline. |
| 61 | TLR-60 | Business Parameter Maintenance - Risk | System / Related Officer | Maintain risk-related parameters such as rules, scoring thresholds. |
| 62 | TLR-61 | Business Parameter Maintenance - Product | System / Related Officer | Maintain product configurations and parameters. |
| 63 | TLR-66 | User and Role Management Admin Maker | System / Admin | Create and approve application users and roles. |
| 64 | TLR-67 | User and Role Management Admin Approver | System / Admin | Create and approve application users and roles. |
| 65 | TLR-65 | User Matrix | System / Admin | Define which roles can access which functions. |
| 66 | TLR-55 | Recontest Process | System / Related Officer | Handle appeal/recontest requests for declined applications. |
| 67 | TLR-62 | [Desktop] Advance Search | System / Related Officer | Enable advanced search for applications and customers. |
| 68 | TLR-63 | [Mobile] Advance Search | System / Related Officer | Enable advanced search for applications and customers. |
| 69 | TLR-22 | DMS (Document Management System) | Document Management System | Integrate with DMS for storing and retrieving documents. |
| 70 | TLR-69 | Reporting | System / Related Officer | Provide reporting and dashboard capabilities. |
| 71 | TLR-72 | Task Management & Re-Assign | System / Related Officer | Support workload distribution and reassignment across users. |
