// UML Entity Types

export type Role = 'Developer' | 'PM' | 'DevOps';

export interface User {
  id: string;
  name: string;
  role: Role;
  login: string;
}

export type TaskStatus = 'Todo' | 'InProgress' | 'Review' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  storyPoints: number;
  createDate: string;
  completeDate?: string;
  assignedUserId?: string;
  sprintId?: string;
  comments: Comment[];
}

export interface Bug extends Task {
  relatedPR?: string;
  relatedTaskId?: string;
  logs: string;
  reproduceSteps: string;
}

export interface Sprint {
  id: string;
  startDate: string;
  endDate: string;
  totalSP: number;
  tasks: string[]; // task IDs
}

export type CIStatus = 'Pending' | 'Running' | 'Success' | 'Failed';

export interface PullRequest {
  prId: string;
  branch: string;
  ciStatus: CIStatus;
  createDate: string;
  createdBy: string;
  relatedTaskId?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  lineCode?: number;
  text: string;
  resolved: boolean;
  userId: string;
  timestamp: string;
}
