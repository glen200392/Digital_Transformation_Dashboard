# OPS Runbook

## Deployment

- Use specific deployments of the Apps Script web app and avoid using "latest".
- Steps to deploy a new version:
  - Update code in main repository.
  - Run automated tests to ensure functionality.
  - Create a new version in the Apps Script editor.
  - Update the web app deployment to the new version.
  - Retain the previous deployment for immediate rollback if issues arise.

## Caching

- Utilize CacheService to cache the results of heavy operations such as `getFullData()` for a short period (1–5 minutes).
- Implement client-side caching in the web UI to reduce repeated API calls while users navigate between pages.

## Failure Handling

- Wrap API interactions in try/catch blocks and implement one automatic retry with exponential backoff.
- If the second attempt fails, fall back to the last successful snapshot of data.
- Display the timestamp of the last successful data refresh to users when serving stale data.

## Schema Validation

- Before processing any data, verify that required sheets exist and columns are present and in the expected order.
- If the schema check fails, notify the system administrator and abort the operation to prevent corrupt data.

## Audit and Logging

- Record every data modification with details about the user, timestamp, modified fields, old values, and new values.
- Provide an interface for administrators to review recent changes and revert problematic entries.
