import { AddTodo } from "@/components/add-todo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TodoItem } from "@/components/todo-item";
import type { Todo } from "@/types/todo";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          My Todo List
        </ThemedText>
        {todos.length > 0 && (
          <ThemedText style={styles.counter}>
            {activeTodos} of {todos.length} active
          </ThemedText>
        )}
      </View>

      <AddTodo onAdd={addTodo} />

      {todos.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>No todos yet!</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Add your first todo above to get started
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  counter: {
    fontSize: 14,
    opacity: 0.6,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
});
