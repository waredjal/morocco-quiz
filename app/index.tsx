import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator, View } from "react-native";
import "../i18n.config";
import { initAds } from "@/utils/state/adStore";
import i18n from "../i18n.config";
import useAppState from "@/utils/state/useStore";
import { useFonts } from 'expo-font';
import { colors } from "@/styles/globalColors";

export default function Index() {
  const [fontsLoaded] = useFonts({
    'Sora-Bold': require('../assets/fonts/Sora-Bold.ttf'),
    'Sora-Regular': require('../assets/fonts/Sora-Regular.ttf'),
    'Sora-SemiBold': require('../assets/fonts/Sora-SemiBold.ttf'),
  });

  const router = useRouter()
  const { language, initUser, initQuizzes } = useAppState.getState();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [appInitialized, setAppInitialized] = useState<boolean>(false);

  // Function to initialize the app
  const initApp = async (user: any) => {

    try {
      setLoading(true);
      await Promise.all([
        initUser(user.uid),
        initQuizzes(),
        initAds()
      ]);
      i18n.changeLanguage(language);
      setAppInitialized(true)
    } catch (error) {
      console.error("Error initializing app:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {

        await initApp(user);
        router.push("/(tabs)/home")

      } else {
        router.push("/login")
      }
    });

    return unsubscribe; // Unsubscribe from listener on unmount
  }, []);

  if (!appInitialized || loading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }
}
