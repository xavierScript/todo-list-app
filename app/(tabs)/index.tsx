import { AddTodo } from "@/components/add-todo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TodoItem } from "@/components/todo-item";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTodos } from "@/contexts/todo-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

export default function HomeScreen() {
  const { todos, addTodo, toggleTodo, deleteTodo, isLoading } = useTodos();
  const tintColor = useThemeColor({}, "tint");
  const dangerColor = useThemeColor(
    { light: "#EF4444", dark: "#F87171" },
    "text"
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={styles.loadingText}>Loading tasks...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedCount = todos.filter((todo) => todo.completed).length;

  // Group and sort todos by priority
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const groupedTodos = {
    overdue: activeTodos.filter((todo) => todo.reminder && todo.reminder < now),
    today: activeTodos.filter(
      (todo) =>
        todo.reminder && todo.reminder >= today && todo.reminder < tomorrow
    ),
    tomorrow: activeTodos.filter(
      (todo) =>
        todo.reminder &&
        todo.reminder >= tomorrow &&
        todo.reminder < dayAfterTomorrow
    ),
    later: activeTodos.filter(
      (todo) => todo.reminder && todo.reminder >= dayAfterTomorrow
    ),
    noReminder: activeTodos.filter((todo) => !todo.reminder),
  };

  // Sort within each group by reminder time
  Object.keys(groupedTodos).forEach((key) => {
    groupedTodos[key as keyof typeof groupedTodos].sort((a, b) => {
      if (!a.reminder || !b.reminder) return 0;
      return a.reminder.getTime() - b.reminder.getTime();
    });
  });

  const overdueCount = groupedTodos.overdue.length;

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={tintColor} />

      {/* Header with gradient-like background */}
      <View style={[styles.headerContainer, { backgroundColor: tintColor }]}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <IconSymbol name="checklist" size={32} color="white" />
            <ThemedText type="title" style={styles.title}>
              My Tasks
            </ThemedText>
          </View>

          {todos.length > 0 && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>
                  {activeTodos.length}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Active</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText
                  style={[
                    styles.statNumber,
                    overdueCount > 0 && { color: dangerColor },
                  ]}
                >
                  {overdueCount}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Overdue</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>
                  {completedCount}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Done</ThemedText>
              </View>
            </View>
          )}
        </View>
      </View>

      <AddTodo onAdd={addTodo} />

      {activeTodos.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="tray" size={64} color="#9CA3AF" />
          <ThemedText style={styles.emptyText}>No tasks yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Tap above to add your first task
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={[
            ...groupedTodos.overdue,
            ...groupedTodos.today,
            ...groupedTodos.tomorrow,
            ...groupedTodos.later,
            ...groupedTodos.noReminder,
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            // Determine section headers
            let sectionHeader = null;
            const firstOverdueIndex = 0;
            const firstTodayIndex = groupedTodos.overdue.length;
            const firstTomorrowIndex =
              firstTodayIndex + groupedTodos.today.length;
            const firstLaterIndex =
              firstTomorrowIndex + groupedTodos.tomorrow.length;
            const firstNoReminderIndex =
              firstLaterIndex + groupedTodos.later.length;

            if (
              index === firstOverdueIndex &&
              groupedTodos.overdue.length > 0
            ) {
              sectionHeader = (
                <View
                  style={[
                    styles.sectionHeader,
                    { backgroundColor: `${dangerColor}15` },
                  ]}
                >
                  <IconSymbol
                    name="exclamationmark.circle.fill"
                    size={18}
                    color={dangerColor}
                  />
                  <ThemedText
                    style={[styles.sectionTitle, { color: dangerColor }]}
                  >
                    Overdue ({groupedTodos.overdue.length})
                  </ThemedText>
                </View>
              );
            } else if (
              index === firstTodayIndex &&
              groupedTodos.today.length > 0
            ) {
              sectionHeader = (
                <View style={styles.sectionHeader}>
                  <IconSymbol name="calendar" size={18} color={tintColor} />
                  <ThemedText
                    style={[styles.sectionTitle, { color: tintColor }]}
                  >
                    Today ({groupedTodos.today.length})
                  </ThemedText>
                </View>
              );
            } else if (
              index === firstTomorrowIndex &&
              groupedTodos.tomorrow.length > 0
            ) {
              sectionHeader = (
                <View style={styles.sectionHeader}>
                  <IconSymbol name="calendar" size={18} color={tintColor} />
                  <ThemedText
                    style={[styles.sectionTitle, { color: tintColor }]}
                  >
                    Tomorrow ({groupedTodos.tomorrow.length})
                  </ThemedText>
                </View>
              );
            } else if (
              index === firstLaterIndex &&
              groupedTodos.later.length > 0
            ) {
              sectionHeader = (
                <View style={styles.sectionHeader}>
                  <IconSymbol name="calendar" size={18} color={tintColor} />
                  <ThemedText
                    style={[styles.sectionTitle, { color: tintColor }]}
                  >
                    Later ({groupedTodos.later.length})
                  </ThemedText>
                </View>
              );
            } else if (
              index === firstNoReminderIndex &&
              groupedTodos.noReminder.length > 0
            ) {
              sectionHeader = (
                <View style={styles.sectionHeader}>
                  <IconSymbol name="list.bullet" size={18} color={tintColor} />
                  <ThemedText
                    style={[styles.sectionTitle, { color: tintColor }]}
                  >
                    No Reminder ({groupedTodos.noReminder.length})
                  </ThemedText>
                </View>
              );
            }

            return (
              <>
                {sectionHeader}
                <TodoItem
                  todo={item}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              </>
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  header: {
    gap: 16,
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
