import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function OnboardingLayout() {
  StatusBar.setHidden(true);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        navigationBarHidden: true,
      }}
    >
      <Stack.Screen name="firstTime" options={{ headerTitle: "First Time" }} />
      <Stack.Screen name="login" options={{ headerTitle: "Login" }} />
    </Stack>
  );
}
