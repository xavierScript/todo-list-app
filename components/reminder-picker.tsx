import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ReminderPickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date; // Optional initial date for editing
}

export function ReminderPicker({
  visible,
  onClose,
  onConfirm,
  initialDate,
}: ReminderPickerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [mode, setMode] = useState<"date" | "time">("date");
  const [showPicker, setShowPicker] = useState(false);

  // Reset/set to initial date when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedDate(initialDate || new Date());
      setMode("date");
    }
  }, [visible]);

  const handleDateChange = (event: any, date?: Date) => {
    // On Android, DateTimePicker closes after selection
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[styles.container, { backgroundColor: colors.cardBackground }]}
        >
          {/* Header */}
          <Text style={[styles.title, { color: colors.text }]}>
            Set Reminder
          </Text>

          {/* Date and Time Display */}
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { borderColor: colors.border }]}
              onPress={() => {
                setMode("date");
                setShowPicker(true);
              }}
            >
              <Text style={[styles.label, { color: colors.icon }]}>Date</Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateTimeButton, { borderColor: colors.border }]}
              onPress={() => {
                setMode("time");
                setShowPicker(true);
              }}
            >
              <Text style={[styles.label, { color: colors.icon }]}>Time</Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {formatTime(selectedDate)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* iOS Date Picker (always visible) */}
          {Platform.OS === "ios" && (
            <DateTimePicker
              value={selectedDate}
              mode={mode}
              display="spinner"
              onChange={handleDateChange}
              textColor={colors.text}
              minimumDate={new Date()}
            />
          )}

          {/* Android Date Picker (modal) */}
          {Platform.OS === "android" && showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode={mode}
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                { borderColor: colors.border },
              ]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: colors.tint },
              ]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  dateTimeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  dateTimeButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#FFFFFF",
  },
});
