// uiMetaStatus.js
// Module providing UI metadata and status utilities for the dashboard.

export function getLastUpdatedTimestamp() {
    // Placeholder: return current ISO timestamp.
    return new Date().toISOString();
}

export function getDataStatus(meta) {
    // Given a metadata object describing data validation, return status label.
    // For example, meta could include missingFields or invalidFormat flags.
    if (!meta) return 'Unknown';
    if (meta.invalid) return 'Invalid format';
    if (meta.missing) return 'Missing data';
    return 'OK';
}

export function isWeeklyUpdateDone(lastUpdatedDate) {
    // Check if the last update happened within the last 7 days.
    const now = new Date();
    const last = new Date(lastUpdatedDate);
    const diffMs = now - last;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return diffMs < sevenDays;
}
