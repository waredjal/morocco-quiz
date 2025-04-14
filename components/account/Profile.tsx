import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import Button from "../../components/Button";
import useAppState from "../../utils/state/useStore";
// import { login, logout } from "../../utils/firebase/auth";
// import { defaultUserState } from "../../utils/state/userState";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { logEvent } from "../../utils/helpers";
// import { FROM_PREMIUM_TO_LOGIN } from "../../utils/events";
// import { deleteUser } from "../../utils/firebase/firestore";
// import { posthog } from "@/utils/posthog";
// import { mixpanel } from "@/utils/analytics";
import { showToast } from "@/utils/Alert";
import Page from "../Page";
import { fontStyles } from "@/style/generalStyles";
import { colors } from "@/styles/globalColors";

const Account = () => {
  const { fromPaywall }: { fromPaywall?: boolean } = useLocalSearchParams();
  const { t } = useTranslation();

  const { email, setIsLoggedin, language } =
    useAppState();

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // useEffect(() => {
  //   if (fromPaywall) {
  //     logEvent(FROM_PREMIUM_TO_LOGIN);
  //   }
  // }, [fromPaywall]);

  const singout = async () => {
    // Alert.alert(
    //   t("account.confirm_logout.title"),
    //   t("account.confirm_logout.body"),
    //   [
    //     {
    //       text: t("general.logout"),
    //       onPress: () => {
    //         setLoading(true);
    //         logout()
    //           .then(() => {
    //             logEvent("user_logged_out");
    //             posthog.reset();
    //             mixpanel.reset();
    //             setUserData(defaultUserState.userData);
    //             setIsLoggedin(false);
    //             router.replace("/(tabs)/settings/login");
    //             showToast(t("general.successful_operation"));
    //           })
    //           .finally(() => setLoading(false));
    //       },
    //       style: "destructive",
    //     },
    //     {
    //       text: t("general.cancel"),
    //       style: "cancel",
    //     },
    //   ]
    // ); //TODO: implement
  };

  const deleteAccount = async () => {
    // Alert.alert(
    //   t("account.confirm_delete.title"),
    //   t("account.confirm_delete.body"),
    //   [
    //     {
    //       text: t("general.continue"),
    //       onPress: () => {
    //         setDeleting(true);
    //         logout()
    //           .then(async () => {
    //             userData.authType === "email" &&
    //               (await login(userData.email, userData.password));
    //             deleteUser(userData._id).then(() => {
    //               setUserData(defaultUserState.userData);
    //               setIsLoggedin(false);
    //               logEvent("account_deleted");
    //               posthog.reset();
    //               mixpanel.reset();
    //               router.replace("/(tabs)/settings/login");
    //             });
    //           })
    //           .finally(() => setDeleting(false));
    //       },
    //       style: "destructive",
    //     },
    //     {
    //       text: t("general.cancel"),
    //       style: "cancel",
    //     },
    //   ]
    // ); // TODO: implement
  };

  // const finishedLessons = levels.flatMap((lev) =>
  //   lev.lessons.filter((less) =>
  //     userData.levels_progress
  //       ?.flatMap((level) => level.lessons)
  //       .includes(less._id)
  //   )
  // );

  return (
    <Page>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Ionicons name="person-circle" size={80} color={colors.gray} />
          <Text style={fontStyles.normal}>{email}</Text>
        </View>
        {/* <View style={{ rowGap: 16 }}>
          <Text style={fontStyles.label}>
            {finishedLessons.length} {t("account.lessons_finished")}
          </Text>
          <View style={[{ rowGap: 8 }]}>
            {finishedLessons.map((lesson, index) => {
              return (
                <View
                  style={[
                    generalStyles.row,
                    {
                      columnGap: 10,
                      backgroundColor: colors.white,
                      padding: 8,
                    },
                  ]}
                  key={index}
                >
                  <Image source={lesson?.image} style={styles.image} />
                  <Text style={{ flex: 1 }}>{lesson[`title_${language}`]}</Text>
                </View>
              );
            })}
          </View>
        </View> */}
        <View style={{ gap: 32 }}>
          <Button
            title={t("general.logout")}
            containerStyle={styles.logoutBtn}
            tintColor={colors.sub_title}
            onPress={singout}
            disabled={loading}
            loading={loading}
          />
          {deleting ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <Text style={styles.deleteBtn} onPress={deleteAccount}>
              {t("account.delete_account")}
            </Text>
          )}
        </View>
      </ScrollView>
    </Page>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 8,
    rowGap: 48,
    backgroundColor: colors.surface,
  },
  title: {
    ...fontStyles.title,
    textAlign: "center",
  },
  logoutBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deleteBtn: {
    ...fontStyles.small_text,
    textAlign: "center",
    color: colors.error,
    textTransform: "uppercase",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
});
