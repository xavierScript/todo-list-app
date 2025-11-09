import { useThemeColor } from "@/hooks/use-theme-color";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ReminderPicker } from "./reminder-picker";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

interface AddTodoProps {
  onAdd: (text: string, reminder?: Date) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [reminder, setReminder] = useState<Date | undefined>(undefined);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor(
    { light: "#F9FAFB", dark: "#1F2937" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor(
    { light: "#9CA3AF", dark: "#6B7280" },
    "icon"
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "icon"
  );

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text.trim(), reminder);
      setText("");
      setReminder(undefined);
    }
  };

  const formatReminderPreview = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) return `Today, ${time}`;
    if (isTomorrow) return `Tomorrow, ${time}`;
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}, ${time}`;
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor, borderColor: isFocused ? tintColor : borderColor },
        ]}
      >
        <IconSymbol
          name="plus.circle.fill"
          size={24}
          color={placeholderColor}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="What needs to be done?"
            placeholderTextColor={placeholderColor}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleAdd}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="done"
          />

          {/* Reminder Row - Shows when typing */}
          {text.trim().length > 0 && (
            <TouchableOpacity
              style={[
                styles.inlineReminderButton,
                reminder && { backgroundColor: `${tintColor}15` },
              ]}
              onPress={() => setShowReminderPicker(true)}
            >
              <IconSymbol
                name={reminder ? "bell.fill" : "bell"}
                size={16}
                color={reminder ? tintColor : placeholderColor}
              />
              <Text
                style={[
                  styles.inlineReminderText,
                  { color: reminder ? tintColor : placeholderColor },
                ]}
              >
                {reminder ? formatReminderPreview(reminder) : "Set Reminder"}
              </Text>
              {reminder && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setReminder(undefined);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <IconSymbol
                    name="xmark.circle.fill"
                    size={14}
                    color={tintColor}
                  />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        </View>

        {text.trim().length > 0 && (
          <TouchableOpacity
            onPress={handleAdd}
            style={[styles.addButton, { backgroundColor: tintColor }]}
            activeOpacity={0.8}
          >
            <IconSymbol name="checkmark" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Reminder Picker Modal */}
      <ReminderPicker
        visible={showReminderPicker}
        onClose={() => setShowReminderPicker(false)}
        onConfirm={(date) => setReminder(date)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 2,
    // Shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputWrapper: {
    flex: 1,
    gap: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 4,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    // Shadow for button
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inlineReminderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  inlineReminderText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
