import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const WELCOME_KEY = "@hasSeenWelcome";

export default function WelcomeScreen() {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");

  const handleGetStarted = async () => {
    try {
      // Mark welcome as seen
      await AsyncStorage.setItem(WELCOME_KEY, "true");
      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to save welcome state:", error);
      router.replace("/(tabs)");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={tintColor} />

      {/* Header Background */}
      <View style={[styles.headerBackground, { backgroundColor: tintColor }]}>
        <View style={styles.headerContent}>
          <IconSymbol name="checklist" size={80} color="white" />
          <ThemedText style={styles.appName}>TaskFlow</ThemedText>
          <ThemedText style={styles.tagline}>
            Organize your life, one task at a time
          </ThemedText>
        </View>
      </View>

      {/* Features Section */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.featuresContainer}>
          {/* Feature 1 */}
          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIconCircle,
                { backgroundColor: `${tintColor}20` },
              ]}
            >
              <IconSymbol name="plus.circle.fill" size={32} color={tintColor} />
            </View>
            <ThemedText style={styles.featureTitle}>Quick Add</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Quickly add tasks with just a tap. Stay organized effortlessly.
            </ThemedText>
          </View>

          {/* Feature 2 */}
          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIconCircle,
                { backgroundColor: `${tintColor}20` },
              ]}
            >
              <IconSymbol name="bell.fill" size={32} color={tintColor} />
            </View>
            <ThemedText style={styles.featureTitle}>Smart Reminders</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Never miss a deadline with customizable notifications.
            </ThemedText>
          </View>

          {/* Feature 3 */}
          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIconCircle,
                { backgroundColor: `${tintColor}20` },
              ]}
            >
              <IconSymbol name="clock" size={32} color={tintColor} />
            </View>
            <ThemedText style={styles.featureTitle}>
              Priority Sorting
            </ThemedText>
            <ThemedText style={styles.featureDescription}>
              Tasks auto-organize by urgency: Overdue, Today, Tomorrow, Later.
            </ThemedText>
          </View>

          {/* Feature 4 */}
          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIconCircle,
                { backgroundColor: `${tintColor}20` },
              ]}
            >
              <IconSymbol
                name="checkmark.circle.fill"
                size={32}
                color={tintColor}
              />
            </View>
            <ThemedText style={styles.featureTitle}>Track Progress</ThemedText>
            <ThemedText style={styles.featureDescription}>
              See your completed tasks and restore them anytime.
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Get Started Button */}
      <View style={[styles.footer, { backgroundColor }]}>
        <TouchableOpacity
          style={[styles.getStartedButton, { backgroundColor: tintColor }]}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          <IconSymbol name="arrow.right" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 8,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  featuresContainer: {
    gap: 20,
  },
  featureCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  featureIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  getStartedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
});
