import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the user
 * Required on iOS, automatic on Android
 */
export async function registerForPushNotificationsAsync() {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permissions not granted");
      return false;
    }

    return true;
  } catch (error) {
    // This is expected in Expo Go - notifications work in production builds
    console.log("Notification setup skipped (Expo Go limitation)");
    return false;
  }
}

/**
 * Schedule a notification for a specific todo
 * @param todoId - Unique ID of the todo
 * @param todoText - Text of the todo to display in notification
 * @param reminderDate - When to send the notification
 * @returns notificationId - ID to cancel the notification later
 */
export async function scheduleNotification(
  todoId: string,
  todoText: string,
  reminderDate: Date
): Promise<string | null> {
  try {
    const trigger = new Date(reminderDate);
    const secondsUntilTrigger = Math.floor(
      (trigger.getTime() - Date.now()) / 1000
    );

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "📋 Todo Reminder",
        body: todoText,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { todoId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilTrigger > 0 ? secondsUntilTrigger : 1,
        repeats: false,
      },
    });

    console.log(
      "✅ Notification scheduled for:",
      reminderDate.toLocaleString()
    );
    return notificationId;
  } catch (error) {
    // Silently fail in Expo Go - works in production builds
    console.log(
      "Notification scheduling skipped (use development build for full features)"
    );
    return null;
  }
}

/**
 * Cancel a scheduled notification
 * @param notificationId - ID returned from scheduleNotification
 */
export async function cancelNotification(notificationId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Failed to cancel notification:", error);
  }
}

/**
 * Cancel all scheduled notifications for this app
 */
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Failed to cancel all notifications:", error);
  }
}

/**
 * Get all currently scheduled notifications
 * Useful for debugging
 */
export async function getAllScheduledNotifications() {
  try {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    console.log("Scheduled notifications:", notifications);
    return notifications;
  } catch (error) {
    console.error("Failed to get scheduled notifications:", error);
    return [];
  }
}
