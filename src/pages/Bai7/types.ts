export type TaskPriority = 'Thấp' | 'Trung bình' | 'Cao';
export type TaskStatus = 'Chưa làm' | 'Đang làm' | 'Đã xong';
export type StorageType = 'localStorage' | 'sessionStorage';

export interface Task {
  id: string;
  name: string;
  assignee: string;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
}
