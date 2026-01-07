/**
 * Core Type Definitions for Digital Transformation Dashboard
 * Version: 3.0.0
 */

// ============================================================================
// User & Team Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  PM = 'pm',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export interface TeamMember {
  userId: string;
  projectId: string;
  role: ProjectRole;
  assignedAt: string;
}

export enum ProjectRole {
  OWNER = 'owner',
  LEAD = 'lead',
  CONTRIBUTOR = 'contributor',
  REVIEWER = 'reviewer',
}

// ============================================================================
// Project Types (4-Level Hierarchy)
// ============================================================================

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  category: ProjectCategory;
  startDate: string;
  endDate?: string;
  progress: number; // 0-100
  budget?: number;
  spent?: number;
  owner: string; // User ID
  teamMembers: string[]; // User IDs
  tags: string[];
  dependencies: string[]; // Project IDs
  phases: Phase[];
  risks: Risk[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ProjectCategory {
  PM_MGMT = 'pm_mgmt', // Project Management
  AI_TOOLS = 'ai_tools', // AI Tools & Promotion
  AI_GOVERNANCE = 'ai_governance', // AI Governance
  HR_COLLAB = 'hr_collab', // HR Collaboration
  IT_COLLAB = 'it_collab', // IT Collaboration
  OTHER = 'other',
}

// ============================================================================
// Phase Types (Level 2)
// ============================================================================

export interface Phase {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  progress: number;
  tasks: Task[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Task Types (Level 3)
// ============================================================================

export interface Task {
  id: string;
  phaseId: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: string; // User ID
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  subtasks: SubTask[];
  dependencies: string[]; // Task IDs
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ============================================================================
// SubTask Types (Level 4)
// ============================================================================

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Risk & Alert Types
// ============================================================================

export interface Risk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  mitigation: string;
  status: RiskStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export enum RiskSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum RiskLikelihood {
  RARE = 'rare',
  UNLIKELY = 'unlikely',
  POSSIBLE = 'possible',
  LIKELY = 'likely',
  CERTAIN = 'certain',
}

export enum RiskImpact {
  NEGLIGIBLE = 'negligible',
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  SEVERE = 'severe',
}

export enum RiskStatus {
  IDENTIFIED = 'identified',
  ASSESSING = 'assessing',
  MITIGATING = 'mitigating',
  MONITORING = 'monitoring',
  RESOLVED = 'resolved',
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  projectId?: string;
  taskId?: string;
  triggeredBy: string;
  triggeredAt: string;
  read: boolean;
  actionUrl?: string;
  metadata: Record<string, any>;
}

export enum AlertType {
  DEADLINE_WARNING = 'deadline_warning',
  BUDGET_EXCEEDED = 'budget_exceeded',
  DEPENDENCY_BLOCKED = 'dependency_blocked',
  RISK_ESCALATED = 'risk_escalated',
  STATUS_CHANGE = 'status_change',
  COMMENT_MENTION = 'comment_mention',
  CUSTOM = 'custom',
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// ============================================================================
// AI Integration Types
// ============================================================================

export interface AIProvider {
  id: string;
  name: string;
  type: AIProviderType;
  apiKey?: string; // Encrypted
  endpoint: string;
  costPerRequest: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum AIProviderType {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  AZURE = 'azure',
  CUSTOM = 'custom',
}

export interface AIUsageLog {
  id: string;
  providerId: string;
  userId: string;
  projectId?: string;
  feature: string;
  prompt: string;
  response: string;
  tokensUsed: number;
  cost: number;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface AIFeature {
  id: string;
  name: string;
  description: string;
  requiresAI: boolean;
  estimatedCost: number;
  enabled: boolean;
}

// ============================================================================
// Audit & History Types
// ============================================================================

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  changes: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  EXPORT = 'export',
  IMPORT = 'import',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

export enum ResourceType {
  PROJECT = 'project',
  PHASE = 'phase',
  TASK = 'task',
  SUBTASK = 'subtask',
  USER = 'user',
  RISK = 'risk',
  COMMENT = 'comment',
  ATTACHMENT = 'attachment',
  AI_PROVIDER = 'ai_provider',
}

export interface ChangeHistory {
  id: string;
  resourceType: ResourceType;
  resourceId: string;
  field: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  changedAt: string;
}

// ============================================================================
// Common Types
// ============================================================================

export interface Comment {
  id: string;
  resourceType: ResourceType;
  resourceId: string;
  content: string;
  author: string;
  mentions: string[]; // User IDs
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  metadata: Record<string, any>;
}

export enum NotificationType {
  ALERT = 'alert',
  MENTION = 'mention',
  ASSIGNMENT = 'assignment',
  DEADLINE = 'deadline',
  STATUS_CHANGE = 'status_change',
  COMMENT = 'comment',
  SYSTEM = 'system',
}

// ============================================================================
// Dashboard & Analytics Types
// ============================================================================

export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalBudget: number;
  spentBudget: number;
  teamMembers: number;
  highRiskProjects: number;
  avgProjectProgress: number;
  upcomingDeadlines: number;
}

export interface ProjectMetrics {
  projectId: string;
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
  budgetUtilization: number;
  daysRemaining: number;
  riskScore: number;
  teamUtilization: number;
  velocity: number; // Tasks completed per week
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// ============================================================================
// Filter & Search Types
// ============================================================================

export interface FilterOptions {
  status?: ProjectStatus | TaskStatus;
  priority?: Priority;
  category?: ProjectCategory;
  assignee?: string;
  dateRange?: DateRange;
  tags?: string[];
  search?: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
  total?: number;
}

// ============================================================================
// Export Types
// ============================================================================

export enum ExportFormat {
  PDF = 'pdf',
  CSV = 'csv',
  MARKDOWN = 'markdown',
  JSON = 'json',
}

export interface ExportOptions {
  format: ExportFormat;
  includeCharts: boolean;
  includeComments: boolean;
  includeHistory: boolean;
  dateRange?: DateRange;
  projects?: string[];
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ResponseMetadata {
  timestamp: string;
  requestId: string;
  pagination?: PaginationOptions;
}

// ============================================================================
// Form & Validation Types
// ============================================================================

export interface FormField<T = any> {
  name: string;
  label: string;
  type: FieldType;
  value: T;
  required: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  placeholder?: string;
  helpText?: string;
}

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  FILE = 'file',
}

export interface ValidationRule {
  type: ValidationType;
  value?: any;
  message: string;
}

export enum ValidationType {
  REQUIRED = 'required',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  MIN_VALUE = 'minValue',
  MAX_VALUE = 'maxValue',
  PATTERN = 'pattern',
  EMAIL = 'email',
  URL = 'url',
  CUSTOM = 'custom',
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// ============================================================================
// State Management Types
// ============================================================================

export interface AppState {
  user: User | null;
  projects: Project[];
  alerts: Alert[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

export interface ProjectState {
  currentProject: Project | null;
  phases: Phase[];
  tasks: Task[];
  risks: Risk[];
  metrics: ProjectMetrics | null;
}

export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}
