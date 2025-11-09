export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  reminder?: Date; // Optional: When to remind user
  notificationId?: string; // Optional: ID of scheduled notification
}
