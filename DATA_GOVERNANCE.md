# DATA GOVERNANCE

## Roles and Permissions
- PM: input weekly status via UI only; cannot directly modify sheets
- 
| Role | Data Input | Sheet Edit | Schema Change | Deployment | Audit / Log |
|----|----|----|----|----|----|
| PM | UI only | ❌ | ❌ | ❌ | View |
| Admin | UI + Sheet | ✅ | Limited | ❌ | Review |
| IT / Owner | ❌ | ✅ | ✅ | ✅ | Full |

PMs interact with data **only through the UI**.  
Direct Sheet editing is restricted to prevent data inconsistency and operational riData Steward/Admin: manage sheet structure, mapping, and corrections; maintain data consistency.
- Viewer/Stakeholder: read-only access to dashboards.

## Sheet Structure
- Each sheet (e.g., Projects, Risks, Status) should have defined columns:
  - `Project ID`: unique identifier (string).
  - `BU` (Business Unit): pre-defined dropdown values.
  - `Project Name`: text.
  - `Owner`: person or team.
  - `Status` (RAG): Red/Amber/Green.
  - `Progress`: number 0-100.
  - `Risks`: count or description.
  - `Next Milestone`: date (YYYY-MM-DD).
  - `Last Updated`: auto timestamp.

## Data Entry Processes
- **Manual Update**: PM uses the UI form to update only essential fields weekly; default values persist from last week.
- **Bulk Import**: use the CSV/Excel import module for initial data loads; ensure columns match the schema.
- **Admin Corrections**: Data Stewards use protected ranges to fix or map data issues; avoid editing formulas.

## Update Frequency
- Weekly status updates due every Monday by 12:00.
- Bulk imports are done at project kickoff or major phase changes.
- Schema reviews occur quarterly or when new fields are needed.

## Audit and Logging
- All changes (add, edit, delete) are recorded in an audit log with user, timestamp, fields changed, old and new values.
- Regularly review audit logs to detect anomalies.
- Provide a "Recent Changes" panel in the UI for transparency.

## Data Quality Rules
- Use data validation in sheets for dropdowns and date formats.
- Ensure unique `Project ID` per record.
- Progress must be between 0 and 100.
- Dates must use ISO format.

## Backup and Recovery
- Schedule periodic backups of the Google Sheets (e.g., daily).
- In case of corruption, restore from the most recent backup and reconcile with audit logs.
