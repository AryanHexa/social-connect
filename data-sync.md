# User Data Sync Flow (Database ↔ Platform)

This document describes the flow for syncing user data (e.g., posts) between the database and the external platform.

---

## Flow Diagram (UML)

```mermaid
flowchart TD

A[Start] --> B{Data in DB?}

B -- No --> C[Fetch data from platform]
C --> D[Update database]
D --> E[Return data from database]

B -- Yes --> E[Return data from database]

E --> F{User requests sync?}

F -- No --> G[End]

F -- Yes --> H{Rate limit hit?}

H -- Yes --> E[Return data from database]

H -- No --> C[Fetch data from platform]
