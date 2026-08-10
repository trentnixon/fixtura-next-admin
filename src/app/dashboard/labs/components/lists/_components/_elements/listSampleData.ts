import {
  Bell,
  Clock,
  Edit,
  FileText,
  Info,
  MessageSquare,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ListTask = {
  id: string;
  label: string;
  completed: boolean;
};

export type ListUser = {
  name: string;
  email: string;
  role: string;
  initials: string;
};

export type ListActionItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
};

export type ListTimelineEvent = {
  icon: LucideIcon;
  label: string;
  time: string;
  color: string;
};

export type ListDescriptionItem = {
  term: string;
  value: string;
  badge?: "success" | "info";
  icon?: LucideIcon;
};

export type ListNotification = {
  id: string;
  icon: LucideIcon;
  label: string;
  time: string;
  unread: boolean;
};

export type ListFeature = {
  id: string;
  title: string;
  description: string;
  items: string[];
};

export const sampleProjects = [
  {
    title: "Project Alpha",
    byline: "Active development project with 5 team members",
  },
  {
    title: "Project Beta",
    byline: "In review phase, scheduled for launch next month",
  },
  {
    title: "Project Gamma",
    byline: "On hold pending client approval",
  },
];

export const sampleTasks: ListTask[] = [
  { id: "task-1", label: "Complete UI component library", completed: true },
  { id: "task-2", label: "Write documentation", completed: false },
  { id: "task-3", label: "Add accessibility features", completed: true },
  { id: "task-4", label: "Create video walkthrough", completed: false },
];

export const sampleUsers: ListUser[] = [
  { name: "John Doe", email: "john@example.com", role: "Admin", initials: "JD" },
  { name: "Jane Smith", email: "jane@example.com", role: "Editor", initials: "JS" },
  { name: "Bob Johnson", email: "bob@example.com", role: "User", initials: "BJ" },
];

export const sampleActionItems: ListActionItem[] = [
  {
    id: "action-1",
    icon: Edit,
    label: "Edit Profile",
    description: "Update your personal information",
  },
  {
    id: "action-2",
    icon: Bell,
    label: "Notifications",
    description: "Manage notification preferences",
  },
  {
    id: "action-3",
    icon: Zap,
    label: "Quick Actions",
    description: "Access frequently used features",
  },
];

export const sampleTimelineEvents: ListTimelineEvent[] = [
  {
    icon: FileText,
    label: "Document created",
    time: "2 hours ago",
    color: "text-blue-500",
  },
  {
    icon: MessageSquare,
    label: "Comment added",
    time: "5 hours ago",
    color: "text-green-500",
  },
  {
    icon: Zap,
    label: "Task completed",
    time: "1 day ago",
    color: "text-orange-500",
  },
];

export const sampleDescriptionItems: ListDescriptionItem[] = [
  { term: "Status", value: "Active", badge: "success" },
  { term: "Last Updated", value: "2 hours ago", icon: Clock },
  { term: "Notifications", value: "Enabled", badge: "info" },
  { term: "Profile", value: "Complete", badge: "success" },
];

export const sampleNotifications: ListNotification[] = [
  {
    id: "notif-1",
    icon: Info,
    label: "New feature available",
    time: "5 min ago",
    unread: true,
  },
  {
    id: "notif-2",
    icon: Bell,
    label: "Profile updated",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: "notif-3",
    icon: Zap,
    label: "System maintenance",
    time: "2 hours ago",
    unread: true,
  },
];

export const sampleFeatures: ListFeature[] = [
  {
    id: "feature-1",
    title: "User Management",
    description: "Manage users, roles, and permissions",
    items: ["Add users", "Edit roles", "Set permissions"],
  },
  {
    id: "feature-2",
    title: "Analytics",
    description: "View reports and insights",
    items: ["Dashboard", "Reports", "Export data"],
  },
];

export const defaultCheckedTaskIds = ["task-1", "task-3"];
export const defaultExpandedFeatureIds = ["feature-1"];
