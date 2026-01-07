/**
 * Project API Service
 * Handles all project-related CRUD operations with Supabase
 */

import { supabase } from '../supabase';
import type {
  Project,
  ApiResponse,
  FilterOptions,
  SortOptions,
  PaginationOptions,
} from '../../types';

// ============================================================================
// Project CRUD Operations
// ============================================================================

export const projectService = {
  /**
   * Get all projects with optional filters
   */
  async getAll(
    filters?: FilterOptions,
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<ApiResponse<Project[]>> {
    try {
      let query = supabase.from('projects').select('*');

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.assignee) {
        query = query.contains('team_members', [filters.assignee]);
      }
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }
      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }
      if (filters?.dateRange) {
        query = query
          .gte('start_date', filters.dateRange.startDate)
          .lte('end_date', filters.dateRange.endDate);
      }

      // Apply sorting
      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.pageSize;
        const to = from + pagination.pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
          pagination,
        },
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },

  /**
   * Get a single project by ID
   */
  async getById(id: string): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, phases(*), risks(*)')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },

  /**
   * Create a new project
   */
  async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...project,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },

  /**
   * Update an existing project
   */
  async update(id: string, updates: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
    } catch (error) {
      console.error('Error updating project:', error);
      return {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },

  /**
   * Delete a project
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) throw error;

      return {
        success: true,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
    } catch (error) {
      console.error('Error deleting project:', error);
      return {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },

  /**
   * Get project dependencies
   */
  async getDependencies(projectId: string): Promise<ApiResponse<Project[]>> {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('dependencies')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      if (!project?.dependencies || project.dependencies.length === 0) {
        return {
          success: true,
          data: [],
          metadata: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        };
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .in('id', project.dependencies);

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
    } catch (error) {
      console.error('Error fetching project dependencies:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },

  /**
   * Update project progress
   */
  async updateProgress(projectId: string, progress: number): Promise<ApiResponse<Project>> {
    return this.update(projectId, { progress });
  },

  /**
   * Add team member to project
   */
  async addTeamMember(projectId: string, userId: string): Promise<ApiResponse<Project>> {
    try {
      const { data: project } = await this.getById(projectId);
      if (!project) throw new Error('Project not found');

      const teamMembers = [...(project.teamMembers || []), userId];
      return this.update(projectId, { teamMembers });
    } catch (error) {
      console.error('Error adding team member:', error);
      return {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },

  /**
   * Remove team member from project
   */
  async removeTeamMember(projectId: string, userId: string): Promise<ApiResponse<Project>> {
    try {
      const { data: project } = await this.getById(projectId);
      if (!project) throw new Error('Project not found');

      const teamMembers = (project.teamMembers || []).filter((id) => id !== userId);
      return this.update(projectId, { teamMembers });
    } catch (error) {
      console.error('Error removing team member:', error);
      return {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },
};

export default projectService;
