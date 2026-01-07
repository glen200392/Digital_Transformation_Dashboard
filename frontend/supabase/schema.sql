-- ============================================================================
-- Digital Transformation Dashboard - Database Schema
-- Version: 3.0.0
-- Database: PostgreSQL (Supabase)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. Users Table (擴展Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'pm', 'member', 'viewer')),
  avatar TEXT,
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. Projects Table (專案)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  category TEXT NOT NULL CHECK (category IN ('pm_mgmt', 'ai_tools', 'ai_governance', 'hr_collab', 'it_collab', 'other')),
  start_date DATE NOT NULL,
  end_date DATE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget DECIMAL(12, 2),
  spent DECIMAL(12, 2) DEFAULT 0,
  owner UUID NOT NULL REFERENCES public.users(id),
  team_members UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  dependencies UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES public.users(id),
  updated_by UUID NOT NULL REFERENCES public.users(id)
);

-- ============================================================================
-- 3. Phases Table (階段)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  start_date DATE NOT NULL,
  end_date DATE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. Tasks Table (任務)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id UUID NOT NULL REFERENCES public.phases(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'in_review', 'blocked', 'completed', 'cancelled')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assignee UUID REFERENCES public.users(id),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  estimated_hours DECIMAL(6, 2),
  actual_hours DECIMAL(6, 2),
  dependencies UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES public.users(id)
);

-- ============================================================================
-- 5. SubTasks Table (子任務)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'in_review', 'blocked', 'completed', 'cancelled')),
  assignee UUID REFERENCES public.users(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. Risks Table (風險)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  likelihood TEXT NOT NULL CHECK (likelihood IN ('rare', 'unlikely', 'possible', 'likely', 'certain')),
  impact TEXT NOT NULL CHECK (impact IN ('negligible', 'minor', 'moderate', 'major', 'severe')),
  mitigation TEXT,
  status TEXT NOT NULL CHECK (status IN ('identified', 'assessing', 'mitigating', 'monitoring', 'resolved')),
  owner UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. Alerts Table (預警)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('deadline_warning', 'budget_exceeded', 'dependency_blocked', 'risk_escalated', 'status_change', 'comment_mention', 'custom')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  triggered_by UUID NOT NULL REFERENCES public.users(id),
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- 8. Notifications Table (通知)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('alert', 'mention', 'assignment', 'deadline', 'status_change', 'comment', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- 9. AI Providers Table (AI服務商)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ai_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('openai', 'anthropic', 'azure', 'custom')),
  api_key_encrypted TEXT,
  endpoint TEXT NOT NULL,
  cost_per_request DECIMAL(10, 6) NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. AI Usage Logs Table (AI使用記錄)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES public.ai_providers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  feature TEXT NOT NULL,
  prompt TEXT,
  response TEXT,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10, 6) DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- 11. Audit Logs Table (審計日誌)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view', 'export', 'import', 'login', 'logout')),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('project', 'phase', 'task', 'subtask', 'user', 'risk', 'comment', 'attachment', 'ai_provider')),
  resource_id UUID,
  changes JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- 12. Comments Table (評論)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('project', 'phase', 'task', 'subtask', 'risk')),
  resource_id UUID NOT NULL,
  content TEXT NOT NULL,
  author UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mentions UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 13. Attachments Table (附件)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('project', 'task', 'comment')),
  resource_id UUID NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Projects
CREATE INDEX idx_projects_owner ON public.projects(owner);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

-- Phases
CREATE INDEX idx_phases_project_id ON public.phases(project_id);
CREATE INDEX idx_phases_status ON public.phases(status);

-- Tasks
CREATE INDEX idx_tasks_phase_id ON public.tasks(phase_id);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);

-- SubTasks
CREATE INDEX idx_subtasks_task_id ON public.subtasks(task_id);
CREATE INDEX idx_subtasks_assignee ON public.subtasks(assignee);

-- Risks
CREATE INDEX idx_risks_project_id ON public.risks(project_id);
CREATE INDEX idx_risks_severity ON public.risks(severity);

-- Alerts
CREATE INDEX idx_alerts_project_id ON public.alerts(project_id);
CREATE INDEX idx_alerts_triggered_at ON public.alerts(triggered_at DESC);
CREATE INDEX idx_alerts_read ON public.alerts(read);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- AI Usage Logs
CREATE INDEX idx_ai_usage_logs_user_id ON public.ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_timestamp ON public.ai_usage_logs(timestamp DESC);

-- Audit Logs
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- Comments
CREATE INDEX idx_comments_resource ON public.comments(resource_type, resource_id);
CREATE INDEX idx_comments_author ON public.comments(author);

-- ============================================================================
-- Functions & Triggers
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phases_updated_at BEFORE UPDATE ON public.phases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subtasks_updated_at BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON public.risks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- Users: 可以查看所有用戶，只能更新自己的資料
CREATE POLICY "Users can view all users" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Projects: 團隊成員可以查看，owner可以更新
CREATE POLICY "Team members can view projects" ON public.projects
  FOR SELECT USING (
    auth.uid() = owner OR
    auth.uid() = ANY(team_members) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'pm'))
  );

CREATE POLICY "Project owners can update projects" ON public.projects
  FOR UPDATE USING (
    auth.uid() = owner OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "PMs can create projects" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'pm'))
  );

CREATE POLICY "Project owners can delete projects" ON public.projects
  FOR DELETE USING (
    auth.uid() = owner OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Phases: 繼承專案權限
CREATE POLICY "View phases if can view project" ON public.phases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = phases.project_id
      AND (owner = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

CREATE POLICY "Modify phases if can modify project" ON public.phases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = phases.project_id
      AND owner = auth.uid()
    )
  );

-- Tasks: 繼承專案權限
CREATE POLICY "View tasks if can view project" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = tasks.project_id
      AND (owner = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

CREATE POLICY "Modify tasks if team member" ON public.tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = tasks.project_id
      AND (owner = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

-- Notifications: 只能看自己的通知
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- AI Providers: 只有admin可以管理
CREATE POLICY "Admins can manage AI providers" ON public.ai_providers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "All users can view AI providers" ON public.ai_providers
  FOR SELECT USING (true);

-- AI Usage Logs: 可以看自己的，admin可以看全部
CREATE POLICY "Users can view own AI usage" ON public.ai_usage_logs
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Audit Logs: Admin可以查看所有，用戶可以查看自己的
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Comments & Attachments: 繼承資源權限（簡化版）
CREATE POLICY "Users can view comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author);

CREATE POLICY "Authors can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author);

CREATE POLICY "Users can view attachments" ON public.attachments
  FOR SELECT USING (true);

CREATE POLICY "Users can upload attachments" ON public.attachments
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- ============================================================================
-- Sample Data (Optional - for testing)
-- ============================================================================

-- Note: 實際使用時，第一個用戶會通過Supabase Auth註冊
-- 這裡只是Schema範例，實際數據會在應用中創建
