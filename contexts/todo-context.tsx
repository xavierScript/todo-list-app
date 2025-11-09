import type { Todo } from "@/types/todo";
import {
  cancelNotification,
  registerForPushNotificationsAsync,
  scheduleNotification,
} from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string, reminder?: Date) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  restoreTodo: (id: string) => void;
  deleteCompletedTodo: (id: string) => void;
  isLoading: boolean;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);
const STORAGE_KEY = "@todos";

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from storage when app starts
  useEffect(() => {
    loadTodos();
    registerForPushNotificationsAsync();
  }, []);

  // Save todos to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveTodos(todos);
    }
  }, [todos, isLoading]);

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        // Convert date strings back to Date objects
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          reminder: todo.reminder ? new Date(todo.reminder) : undefined,
        }));
        setTodos(todosWithDates);
      }
    } catch (error) {
      console.error("Failed to load todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTodos = async (todosToSave: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todosToSave));
    } catch (error) {
      console.error("Failed to save todos:", error);
    }
  };

  const addTodo = async (text: string, reminder?: Date) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      reminder,
    };

    // Schedule notification if reminder is set
    if (reminder) {
      const notificationId = await scheduleNotification(
        newTodo.id,
        text,
        reminder
      );
      if (notificationId) {
        newTodo.notificationId = notificationId;
      }
    }

    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);

    // Cancel notification when todo is completed
    if (todo && !todo.completed && todo.notificationId) {
      await cancelNotification(todo.notificationId);
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);

    // Cancel notification when todo is deleted
    if (todo?.notificationId) {
      await cancelNotification(todo.notificationId);
    }

    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const restoreTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);

    // Reschedule notification if todo had a reminder and it's in the future
    if (todo?.reminder && todo.reminder > new Date() && !todo.notificationId) {
      const notificationId = await scheduleNotification(
        todo.id,
        todo.text,
        todo.reminder
      );

      setTodos(
        todos.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: false,
                notificationId: notificationId || undefined,
              }
            : t
        )
      );
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: false } : todo
        )
      );
    }
  };

  const deleteCompletedTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);

    // Cancel notification if it exists
    if (todo?.notificationId) {
      await cancelNotification(todo.notificationId);
    }

    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        restoreTodo,
        deleteCompletedTodo,
        isLoading,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
}
