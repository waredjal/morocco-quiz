import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";


import { useTranslation } from "react-i18next";
import StyledText from "../StyledText";
import EmailAuth from "./EmailAuth";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import ViewContainer from "../layout/ViewContainer";
import { fontStyles, generalStyles } from "@/style/generalStyles";
import { colors } from "@/styles/globalColors";
import LoginButtons from "./LoginButtons";

const AuthForm = ({ type }: { type: "login" | "create" }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { fromPaywall }: { fromPaywall?: "true" | undefined } =
    useLocalSearchParams();

  React.useEffect(() => {
    if (fromPaywall) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [fromPaywall]);

  const customGoBack = React.useCallback(() => {
    if (fromPaywall) {
      router.replace("/(tabs)/home");
      router.setParams({ fromPaywall: undefined });
    }
  }, [fromPaywall]);

  const toggleLogin = React.useCallback(() => {
    if (type === "create") {
      router.replace({
        pathname: "/(tabs)/settings/login",
        params: { fromPaywall },
      });
    } else {
      router.replace({
        pathname: "/(tabs)/settings/createAccount",
        params: { fromPaywall },
      });
    }
  }, [type, fromPaywall]);

  return (
    <ViewContainer>
      <ScrollView contentContainerStyle={styles.container}>
        {fromPaywall && (
          <View style={styles.header}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.gray}
              onPress={customGoBack}
            />
            <StyledText
              type="semiBold"
              textStyle={{ textTransform: "capitalize" }}
            >
              {type === "create"
                ? t("account.create_profile")
                : t("general.login")}
            </StyledText>
            <Ionicons name="arrow-back" size={22} color={"rgba(0,0,0,0)"} />
          </View>
        )}

        {/* {/* <AuthButtons type={type} /> */}
        <LoginButtons noGuest containerStyle={{ width: '100%' }} />

        <View style={[generalStyles.centerContent, { marginVertical: 16 }]}>
          <View style={styles.line} />
          <StyledText textStyle={styles.or} color={colors.gray}>
            {t("general.or")}
          </StyledText>
        </View>

        <EmailAuth type={type} />

        <View style={[generalStyles.row, { alignSelf: "center", gap: 4 }]}>
          <Text style={styles.switchType}>
            {type === "create"
              ? t("account.already_have_account")
              : t("account.no_account")}{" "}
          </Text>
          <TouchableOpacity onPress={toggleLogin}>
            <Text style={styles.link}>
              {type === "login"
                ? t("account.create_profile")
                : t("general.login")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ViewContainer>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 16,
    position: "absolute",
  },
  or: {
    textTransform: "capitalize",
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
  },
  header: {
    ...generalStyles.row_sp_bt,
    marginBottom: 16,
  },
  link: {
    ...fontStyles.bold,
    textTransform: "capitalize",
    color: colors.active,
  },
  switchType: {
    ...fontStyles.semiBold,
    textAlign: "center",
  },
});
