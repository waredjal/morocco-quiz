import PaywallModal from "@/components/modals/PaywallModal";

import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { Pressable } from "react-native";
import Premium from "../premium";
import useAppState from "@/utils/state/useStore";

const Layout = () => {

  const [paywallVisible, setPaywallVisible] = useState<boolean>(false)

  const isPremium = useAppState((state) => state.is_premium_user);


  useEffect(() => {
    if (!isPremium) {
      setTimeout(() => setPaywallVisible(true), 2000)

    }
  }, [isPremium])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar hidden={false} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#E1513E",
          tabBarStyle: {
            height: 55,
            paddingTop: 10,
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={28}
                name={focused ? "bar-chart" : "bar-chart-outline"}
                color={color}
              />
            ),
            tabBarButton: (props) => (
              <Pressable {...props} android_ripple={{ color: "transparent" }} />
            ),
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={28}
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
            tabBarButton: (props) => (
              <Pressable {...props} android_ripple={{ color: "transparent" }} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={28}
                name={focused ? "settings" : "settings-outline"}
                color={color}
              />
            ),
            tabBarButton: (props) => (
              <Pressable {...props} android_ripple={{ color: "transparent" }} />
            ),
          }}
        />
      </Tabs>
      <Premium isModal isVisible={paywallVisible} onClose={() => setPaywallVisible(false)} />
    </SafeAreaView>
  );
};

export default Layout;
