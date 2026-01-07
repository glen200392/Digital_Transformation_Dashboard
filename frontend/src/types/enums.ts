// Enums as const objects for better TypeScript compatibility
export const UserRole = {
  ADMIN: 'admin',
  PM: 'pm',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const;

export const ProjectRole = {
  OWNER: 'owner',
  LEAD: 'lead',
  CONTRIBUTOR: 'contributor',
  REVIEWER: 'reviewer',
} as const;

export const ProjectStatus = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const ProjectCategory = {
  PM_MGMT: 'pm_mgmt',
  AI_TOOLS: 'ai_tools',
  AI_GOVERNANCE: 'ai_governance',
  HR_COLLAB: 'hr_collab',
  IT_COLLAB: 'it_collab',
  OTHER: 'other',
} as const;

export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  BLOCKED: 'blocked',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Type exports
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type ProjectRole = (typeof ProjectRole)[keyof typeof ProjectRole];
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
export type Priority = (typeof Priority)[keyof typeof Priority];
export type ProjectCategory = (typeof ProjectCategory)[keyof typeof ProjectCategory];
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
