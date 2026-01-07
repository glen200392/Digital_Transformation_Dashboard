import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, Project, Alert, Notification, UIState } from '../types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  markAlertAsRead: (id: string) => void;
  removeAlert: (id: string) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  uiState: UIState;
  setUIState: (updates: Partial<UIState>) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialUIState: UIState = {
  sidebarCollapsed: false,
  theme: 'light',
  language: 'zh-TW',
  notifications: true,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        projects: [],
        alerts: [],
        notifications: [],
        uiState: initialUIState,
        loading: false,
        error: null,
        setUser: (user) => set({ user }),
        setProjects: (projects) => set({ projects }),
        addProject: (project) =>
          set((state) => ({ projects: [...state.projects, project] })),
        updateProject: (id, updates) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          })),
        removeProject: (id) =>
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
          })),
        setAlerts: (alerts) => set({ alerts }),
        addAlert: (alert) =>
          set((state) => ({ alerts: [alert, ...state.alerts] })),
        markAlertAsRead: (id) =>
          set((state) => ({
            alerts: state.alerts.map((a) =>
              a.id === id ? { ...a, read: true } : a
            ),
          })),
        removeAlert: (id) =>
          set((state) => ({
            alerts: state.alerts.filter((a) => a.id !== id),
          })),
        setNotifications: (notifications) => set({ notifications }),
        addNotification: (notification) =>
          set((state) => ({
            notifications: [notification, ...state.notifications],
          })),
        markNotificationAsRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
          })),
        clearNotifications: () => set({ notifications: [] }),
        setUIState: (updates) =>
          set((state) => ({
            uiState: { ...state.uiState, ...updates },
          })),
        toggleSidebar: () =>
          set((state) => ({
            uiState: {
              ...state.uiState,
              sidebarCollapsed: !state.uiState.sidebarCollapsed,
            },
          })),
        toggleTheme: () =>
          set((state) => ({
            uiState: {
              ...state.uiState,
              theme: state.uiState.theme === 'light' ? 'dark' : 'light',
            },
          })),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        reset: () =>
          set({
            user: null,
            projects: [],
            alerts: [],
            notifications: [],
            uiState: initialUIState,
            loading: false,
            error: null,
          }),
      }),
      {
        name: 'dt-dashboard-storage',
        partialize: (state) => ({
          user: state.user,
          uiState: state.uiState,
        }),
      }
    ),
    { name: 'AppStore' }
  )
);

export default useAppStore;
