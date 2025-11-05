import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E5E5EA', dark: '#3A3A3C' }, 'icon');

  return (
    <ThemedView style={[styles.container, { borderColor }]}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onToggle(todo.id)}
        activeOpacity={0.7}>
        <View
          style={[
            styles.checkbox,
            { borderColor: tintColor },
            todo.completed && { backgroundColor: tintColor },
          ]}>
          {todo.completed && <IconSymbol name="checkmark" size={16} color="white" />}
        </View>
      </TouchableOpacity>

      <ThemedText
        style={[
          styles.text,
          todo.completed && styles.completedText,
          todo.completed && { color: textColor + '80' },
        ]}>
        {todo.text}
      </ThemedText>

      <TouchableOpacity
        onPress={() => onDelete(todo.id)}
        style={styles.deleteButton}
        activeOpacity={0.7}>
        <IconSymbol name="trash" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteButton: {
    padding: 4,
  },
});
