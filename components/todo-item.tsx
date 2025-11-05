import { useThemeColor } from "@/hooks/use-theme-color";
import type { Todo } from "@/types/todo";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
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

        <ThemedText
          style={[
            styles.text,
            todo.completed && styles.completedText,
            todo.completed && { color: textColor, opacity: 0.5 },
          ]}
        >
          {todo.text}
        </ThemedText>

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
  text: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: "line-through",
  },
  deleteButton: {
    padding: 6,
    marginLeft: 4,
  },
});
