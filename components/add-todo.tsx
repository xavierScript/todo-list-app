import { useThemeColor } from "@/hooks/use-theme-color";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
      onAdd(text.trim());
      setText("");
    }
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
  input: {
    flex: 1,
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
});
