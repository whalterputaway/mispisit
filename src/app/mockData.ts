import { User, Task, Bug, Sprint, PullRequest, Comment } from './types';

export const users: User[] = [
  { id: 'u1', name: 'Alice Chen', role: 'Developer', login: 'alice.chen' },
  { id: 'u2', name: 'Bob Smith', role: 'PM', login: 'bob.smith' },
  { id: 'u3', name: 'Carol Davis', role: 'DevOps', login: 'carol.davis' },
  { id: 'u4', name: 'David Kim', role: 'Developer', login: 'david.kim' },
];

export const comments: Comment[] = [
  { id: 'c1', text: 'Need to refactor this function', resolved: false, userId: 'u1', timestamp: '2026-05-10T10:30:00', lineCode: 42 },
  { id: 'c2', text: 'LGTM, approved', resolved: true, userId: 'u4', timestamp: '2026-05-10T14:20:00' },
  { id: 'c3', text: 'Missing edge case for null values', resolved: false, userId: 'u1', timestamp: '2026-05-11T09:15:00', lineCode: 87 },
];

export const tasks: Task[] = [
  {
    id: 't1',
    title: 'Implement user authentication',
    description: 'Add OAuth2 login flow with JWT tokens',
    status: 'InProgress',
    priority: 'High',
    storyPoints: 8,
    createDate: '2026-05-01T09:00:00',
    assignedUserId: 'u1',
    sprintId: 's1',
    comments: [comments[0]],
  },
  {
    id: 't2',
    title: 'Design dashboard UI',
    description: 'Create wireframes and mockups for admin dashboard',
    status: 'Done',
    priority: 'Medium',
    storyPoints: 5,
    createDate: '2026-05-02T10:00:00',
    completeDate: '2026-05-08T16:00:00',
    assignedUserId: 'u4',
    sprintId: 's1',
    comments: [],
  },
  {
    id: 't3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'Review',
    priority: 'Critical',
    storyPoints: 13,
    createDate: '2026-05-03T11:00:00',
    assignedUserId: 'u3',
    sprintId: 's1',
    comments: [comments[1]],
  },
  {
    id: 't4',
    title: 'API rate limiting',
    description: 'Implement rate limiting middleware',
    status: 'Todo',
    priority: 'Medium',
    storyPoints: 3,
    createDate: '2026-05-05T14:00:00',
    assignedUserId: 'u1',
    comments: [],
  },
];

export const bugs: Bug[] = [
  {
    id: 'b1',
    title: 'Login page crashes on Safari',
    description: 'Application crashes when attempting to login on Safari browser',
    status: 'InProgress',
    priority: 'Critical',
    storyPoints: 5,
    createDate: '2026-05-09T08:30:00',
    assignedUserId: 'u1',
    sprintId: 's1',
    relatedPR: 'pr1',
    relatedTaskId: 't1',
    logs: 'TypeError: Cannot read property \'token\' of undefined at auth.js:45\nStack trace: ...',
    reproduceSteps: '1. Open Safari browser\n2. Navigate to /login\n3. Enter credentials\n4. Click Login button\n5. Observe crash',
    comments: [],
  },
  {
    id: 'b2',
    title: 'CI pipeline fails intermittently',
    description: 'Test suite fails randomly on CI server',
    status: 'Todo',
    priority: 'High',
    storyPoints: 8,
    createDate: '2026-05-10T12:00:00',
    assignedUserId: 'u3',
    relatedPR: 'pr2',
    logs: 'Test "should handle concurrent requests" failed\nTimeout exceeded: 5000ms',
    reproduceSteps: '1. Push code to main branch\n2. Wait for CI to start\n3. Observe random failures in integration tests',
    comments: [],
  },
];

export const sprints: Sprint[] = [
  {
    id: 's1',
    startDate: '2026-05-01',
    endDate: '2026-05-15',
    totalSP: 29,
    tasks: ['t1', 't2', 't3', 'b1'],
  },
  {
    id: 's2',
    startDate: '2026-05-16',
    endDate: '2026-05-30',
    totalSP: 0,
    tasks: [],
  },
];

export const pullRequests: PullRequest[] = [
  {
    prId: 'pr1',
    branch: 'feature/oauth-login',
    ciStatus: 'Failed',
    createDate: '2026-05-09T15:00:00',
    createdBy: 'u1',
    relatedTaskId: 't1',
    comments: [comments[0], comments[2]],
  },
  {
    prId: 'pr2',
    branch: 'feature/ci-pipeline',
    ciStatus: 'Running',
    createDate: '2026-05-10T09:00:00',
    createdBy: 'u3',
    relatedTaskId: 't3',
    comments: [],
  },
  {
    prId: 'pr3',
    branch: 'feature/dashboard-ui',
    ciStatus: 'Success',
    createDate: '2026-05-08T14:00:00',
    createdBy: 'u4',
    relatedTaskId: 't2',
    comments: [comments[1]],
  },
];

export let currentUser: User = users[0]; // Default to Developer

export const setCurrentUser = (user: User) => {
  currentUser = user;
};
