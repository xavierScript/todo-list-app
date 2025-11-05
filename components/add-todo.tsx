import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState('');
  const colorScheme = useColorScheme();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#F2F2F7', dark: '#1C1C1E' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#C7C7CC', dark: '#636366' }, 'icon');

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.inputContainer, { backgroundColor }]}>
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="Add a new todo..."
          placeholderTextColor={placeholderColor}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          onPress={handleAdd}
          disabled={!text.trim()}
          style={[
            styles.addButton,
            { backgroundColor: text.trim() ? tintColor : placeholderColor },
          ]}
          activeOpacity={0.7}>
          <IconSymbol name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
