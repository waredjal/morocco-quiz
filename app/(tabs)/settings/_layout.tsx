
import { colors } from "@/styles/globalColors";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, SafeAreaView, StatusBar } from "react-native";

function _layout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "regular",
          headerTitle: t("settings.title"),
          headerLargeTitle: true,
          headerTintColor: colors.title,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          headerShown: true,
          headerTitle: t("settings.profile"),
        }}
      />
      <Stack.Screen
        name="updateLanguage"
        options={{
          headerShown: true,
          headerTitle: t("settings.language"),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          headerTitle: t("general.login"),
        }}
      />
      <Stack.Screen
        name="createAccount"
        options={{
          headerShown: true,
          headerTitle: t("account.create_profile"),
        }}
      />
    </Stack>
  );
}

export default _layout;
