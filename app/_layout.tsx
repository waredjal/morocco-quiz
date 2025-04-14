import RootLoader from "@/components/modals/RootLoader";
import IAPProvider from "@/IAPContext";
import { Stack } from "expo-router";
import QuizResult from "./quiz/result";

export default function RootLayout() {
  // return <QuizResult /> // TODO: remove 
  return (

    <IAPProvider>
      <RootLoader />
      <Stack
        screenOptions={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      >
        <Stack.Screen name="quiz" />
        <Stack.Screen name="categories" />
      </Stack>
    </IAPProvider>
  );
}
