import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const WELCOME_KEY = "@hasSeenWelcome";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkWelcome = async () => {
      try {
        const hasSeenWelcome = await AsyncStorage.getItem(WELCOME_KEY);

        // Small delay to ensure navigation is ready
        setTimeout(() => {
          if (hasSeenWelcome === "true") {
            router.replace("/(tabs)");
          } else {
            router.replace("/welcome");
          }
        }, 100);
      } catch (error) {
        console.error("Error checking welcome status:", error);
        router.replace("/(tabs)");
      }
    };

    checkWelcome();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#6366F1",
      }}
    >
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}
