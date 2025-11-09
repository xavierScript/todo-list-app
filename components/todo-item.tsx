import { useThemeColor } from "@/hooks/use-theme-color";
import type { Todo } from "@/types/todo";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const dangerColor = useThemeColor(
    { light: "#EF4444", dark: "#F87171" },
    "text"
  );
  const iconColor = useThemeColor(
    { light: "#9CA3AF", dark: "#6B7280" },
    "icon"
  );

  // Check if reminder is overdue
  const isOverdue =
    todo.reminder && todo.reminder < new Date() && !todo.completed;

  const formatReminder = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // If overdue
    if (diffMs < 0) {
      const overdueMins = Math.abs(diffMins);
      const overdueHours = Math.abs(diffHours);
      const overdueDays = Math.abs(diffDays);

      if (overdueDays > 0) return `${overdueDays}d overdue`;
      if (overdueHours > 0) return `${overdueHours}h overdue`;
      return `${overdueMins}m overdue`;
    }

    // If upcoming
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (diffMins < 60) return `in ${diffMins}m`;
    if (isToday) return `Today, ${time}`;
    if (isTomorrow) return `Tomorrow, ${time}`;
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}, ${time}`;
  };

  return (
    <View style={styles.cardWrapper}>
      <ThemedView style={[styles.container, { backgroundColor: cardBg }]}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onToggle(todo.id)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: todo.completed ? tintColor : "#D1D5DB" },
              todo.completed && { backgroundColor: tintColor },
            ]}
          >
            {todo.completed && (
              <IconSymbol name="checkmark" size={18} color="white" />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <ThemedText
            style={[
              styles.text,
              todo.completed && styles.completedText,
              todo.completed && { color: textColor, opacity: 0.5 },
            ]}
          >
            {todo.text}
          </ThemedText>

          {/* Reminder Display */}
          {todo.reminder && (
            <View style={styles.reminderContainer}>
              <IconSymbol
                name={isOverdue ? "exclamationmark.circle.fill" : "clock"}
                size={14}
                color={isOverdue ? dangerColor : iconColor}
              />
              <Text
                style={[
                  styles.reminderText,
                  { color: isOverdue ? dangerColor : iconColor },
                ]}
              >
                {formatReminder(todo.reminder)}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onDelete(todo.id)}
          style={styles.deleteButton}
          activeOpacity={0.6}
        >
          <IconSymbol name="trash" size={20} color={dangerColor} />
        </TouchableOpacity>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    // Shadow for iOS
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    gap: 6,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: "line-through",
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reminderText: {
    fontSize: 12,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 6,
    marginLeft: 4,
  },
});
