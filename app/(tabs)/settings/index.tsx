import {
  FlatList,
  Linking,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import StyledText from "@/components/StyledText";
// import * as Updates from "expo-updates";
import { router } from "expo-router";
import useAppState from "@/utils/state/useStore";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { colors } from "@/styles/globalColors";
import Page from "@/components/Page";
import { generalStyles } from "@/style/generalStyles";
import { LINKS } from "@/utils/constants";
import { CustomButton } from "@/components/CustomButton";
import { logout } from "@/api/auth";
import LogoutConfirmationModal from "@/components/settings/LogoutConfirmationModal";
import { auth } from "@/firebase";

const Option = ({
  color,
  icon,
  onPress,
  label,
  showToggle,
  toggleActive,
  toggleSwitch,
}: {
  label: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  showToggle?: boolean;
  toggleActive?: boolean;
  toggleSwitch?: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={[styles.icon,
      // { borderWidth: .3, borderColor: colors.accent },
      { backgroundColor: colors.white }
      ]}>
        <Ionicons name={icon} size={20} color={colors.accent} />
      </View>
      <StyledText>{label}</StyledText>
      {showToggle ? (
        <Switch
          onValueChange={toggleSwitch}
          value={toggleActive}
          style={{ position: "absolute", right: 0 }}
        />
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.gray}
          style={{ position: "absolute", right: 0 }}
        />
      )}
    </TouchableOpacity>
  );
};

const Settings = () => {
  const { language, links, isLoggedin, setLinks, clearState } = useAppState();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { t } = useTranslation();

  useEffect(() => { setLinks(LINKS) }, [])

  const goToScreen = React.useCallback(
    (screen: string) => router.navigate("/settings/" + screen),
    []
  );

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => item.renderSection(),
    [language]
  );

  const handleLogout = async () => {
    try {
      clearState();
      await logout();
      router.replace("/(onboarding)/login");
    } catch (e) {
      console.error("Erreur lors de la déconnexion:", e);
    }
  };

  // const handleLogoutPress = () => {
  //   const currentUser = auth().currentUser;
  //   if (currentUser?.isAnonymous) {
  //     setShowLogoutModal(true);
  //   } else {
  //     handleLogout();
  //   }
  // };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };


  const sections = React.useMemo(
    () => [
      {
        renderSection: () => (
          <View style={styles.section}>
            <Option
              label={t("settings.profile")}
              icon="person"
              color={colors.active}
              onPress={() => goToScreen(isLoggedin ? "account" : "login")}
            />
            <View style={generalStyles.line} />
            <Option
              label={t("settings.language")}
              icon="language"
              color={colors.orange}
              onPress={() => goToScreen("updateLanguage")}
            />
            {/* <View style={generalStyles.line} />
            <Option
              label={t("settings.daily_darija")}
              icon="notifications"
              color={colors.success}
              toggleSwitch={toggleDailyDarija}
              showToggle
              toggleActive={sendDailyDarija}
            /> */}
          </View>
        ),
      },
      {
        renderSection: () => (
          <View style={styles.section}>
            {links.map((item: any, index) => (
              <View key={item.icon} style={{ gap: 8 }}>
                <Option
                  label={item[`text_${language}`]}
                  icon={item.icon}
                  color={item.color}
                  onPress={() => Linking.openURL(item.url)}
                />
                {index + 1 < links.length && (
                  <View style={generalStyles.line} />
                )}
              </View>
            ))}
          </View>
        ),
      },
      {
        renderSection: () => (
          <View style={styles.section}>
            <Option
              label={t("settings.logout")}
              icon="exit"
              color={colors.orange}
              onPress={() => setShowLogoutModal(true)}
            />
          </View>
        ),
      },
    ],
    [language, links, isLoggedin]
  );

  return (
    <Page>
      <FlatList
        data={sections}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListFooterComponent={
          <>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              contentFit="contain"
            />
            <StyledText
              textStyle={{ textAlign: "center" }}
              fontSize={12}
              color={colors.gray}
            >
              v1.0.0
              {/* v{Updates.runtimeVersion} */}
            </StyledText>
          </>
        }
      />
      <LogoutConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </Page >
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  section: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 5,
    gap: 8,
  },
  option: {
    ...generalStyles.row,
    gap: 12,
    height: 40,
  },
  icon: {
    height: 30,
    width: 30,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 80,
    aspectRatio: 4 / 1,
    alignSelf: "center",
  },
});
