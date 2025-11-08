import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTodos } from "@/contexts/todo-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Todo } from "@/types/todo";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

function CompletedTodoItem({
  todo,
  onRestore,
  onDelete,
}: {
  todo: Todo;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const dangerColor = useThemeColor(
    { light: "#EF4444", dark: "#F87171" },
    "text"
  );
  const successColor = useThemeColor(
    { light: "#10B981", dark: "#34D399" },
    "text"
  );

  return (
    <View style={styles.cardWrapper}>
      <ThemedView style={[styles.container, { backgroundColor: cardBg }]}>
        <View
          style={[
            styles.checkbox,
            { borderColor: tintColor, backgroundColor: tintColor },
          ]}
        >
          <IconSymbol name="checkmark" size={18} color="white" />
        </View>

        <ThemedText
          style={[
            styles.text,
            styles.completedText,
            { color: textColor, opacity: 0.5 },
          ]}
        >
          {todo.text}
        </ThemedText>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onRestore(todo.id)}
            style={styles.actionButton}
            activeOpacity={0.6}
          >
            <IconSymbol
              name="arrow.uturn.backward"
              size={20}
              color={successColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(todo.id)}
            style={styles.actionButton}
            activeOpacity={0.6}
          >
            <IconSymbol name="trash" size={20} color={dangerColor} />
          </TouchableOpacity>
        </View>
      </ThemedView>
    </View>
  );
}

export default function CompletedScreen() {
  const { todos, restoreTodo, deleteCompletedTodo, isLoading } = useTodos();
  const tintColor = useThemeColor({}, "tint");

  const completedTodos = todos.filter((todo) => todo.completed);

  if (isLoading) {
    return (
      <ThemedView style={styles.screenContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={styles.loadingText}>Loading tasks...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor={tintColor} />

      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: tintColor }]}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <IconSymbol name="checkmark.circle.fill" size={32} color="white" />
            <ThemedText type="title" style={styles.title}>
              Completed
            </ThemedText>
          </View>

          {completedTodos.length > 0 && (
            <ThemedText style={styles.subtitle}>
              {completedTodos.length} task
              {completedTodos.length !== 1 ? "s" : ""} completed
            </ThemedText>
          )}
        </View>
      </View>

      {completedTodos.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="checkmark.circle" size={64} color="#9CA3AF" />
          <ThemedText style={styles.emptyText}>No completed tasks</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Complete tasks to see them here
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={completedTodos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CompletedTodoItem
              todo={item}
              onRestore={restoreTodo}
              onDelete={deleteCompletedTodo}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  header: {
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
  cardWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: "line-through",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
