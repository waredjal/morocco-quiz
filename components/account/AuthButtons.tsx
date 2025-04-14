import { Platform, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Button from "../Button";
import { Image } from "expo-image";
import colors from "@/styles/colors";
import { socialAuth } from "@/utils/firebase/auth";
import { createUser, getUser } from "@/utils/helpers";
import useAppState from "@/utils/state/useStore";
import { useIAP } from "@/IAPContext";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import StyledText from "@/components/StyledText";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { firebase } from "@react-native-firebase/auth";
import { getDataFromStorage, storeData } from "@/utils/storage";
import { UserI } from "@/utils/types";
import { LOGIN_TYPE } from "@/utils/enums";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

const AuthButtons = ({ type }: { type: "login" | "create" }) => {
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const { userData } = useAppState();
  const { isPremiumUser } = useIAP();
  const { t } = useTranslation();

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "808733437308-cu3acc9vsvsn26uf741hqb3sat8pfdf2.apps.googleusercontent.com",
      scopes: ["https://www.googleapis.com/auth/userinfo.email"],
      iosClientId:
        "808733437308-jirsdd3mjmmsvnhc6iq9nh1atfdpublt.apps.googleusercontent.com",
    });
  }, []);

  const handleAppleAuth = React.useCallback(async () => {
    setLoadingApple(true);
    try {
      // 1). start a apple sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL],
      });

      // 2). if the request was successful, extract the token and nonce
      const { identityToken, nonce } = appleAuthRequestResponse;

      // can be null in some scenarios
      if (identityToken) {
        // 3). create a Firebase `AppleAuthProvider` credential
        const appleCredential = firebase.auth.AppleAuthProvider.credential(
          identityToken,
          nonce
        );

        await socialAuth(appleCredential);

        const email =
          appleAuthRequestResponse.email ||
          getDataFromStorage("email", "string")?.toString();

        if (email) {
          appleAuthRequestResponse.email &&
            storeData("email", appleAuthRequestResponse.email);

          if (type === "create") {
            const newUser: UserI = {
              ...userData,
              email,
              password: "",
              authType: LOGIN_TYPE.APPLE,
            };
            await createUser(newUser, isPremiumUser, () =>
              router.replace("/(tabs)/settings/account")
            );
          } else {
            await getUser(email, LOGIN_TYPE.APPLE, isPremiumUser, () =>
              router.replace("/(tabs)/settings/account")
            );
          }
        } else {
          alert(t("account.email_notice"));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingApple(false);
    }
  }, [type, userData, isPremiumUser]);

  const googleAuth = React.useCallback(async () => {
    setLoadingGoogle(true);
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();

      if (signInResult?.data?.idToken) {
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(
          signInResult.data.idToken
        );

        await socialAuth(googleCredential);

        if (type === "create") {
          await createUser(
            {
              ...userData,
              email: signInResult?.data?.user?.email,
              password: "",
              authType: LOGIN_TYPE.GOOGLE,
            },
            isPremiumUser,
            () => router.replace("/(tabs)/settings/account")
          ).then();
        } else {
          await getUser(
            signInResult?.data?.user?.email,
            LOGIN_TYPE.GOOGLE,
            isPremiumUser,
            () => router.replace("/(tabs)/settings/account")
          );
        }
      }
    } catch (error) {
      __DEV__ && console.error(error);
    } finally {
      setLoadingGoogle(false);
    }
  }, [type]);

  return (
    <View style={{ gap: 8 }}>
      {Platform.OS === "ios" && (
        <>
          <StyledText fontSize={11} color={colors.sub_title}>
            * {t("account.email_notice")}
          </StyledText>
          <Button
            title={"Apple"}
            containerStyle={styles.socialBtn}
            onPress={handleAppleAuth}
            loading={loadingApple}
            icon={
              <Image
                source={"https://www.svgrepo.com/show/69341/apple-logo.svg"}
                style={styles.socialIcon}
                contentFit="contain"
              />
            }
          />
        </>
      )}
      <Button
        title={"Google"}
        containerStyle={styles.socialBtn}
        onPress={googleAuth}
        loading={loadingGoogle}
        icon={
          <Image
            source={"https://www.svgrepo.com/show/303108/google-icon-logo.svg"}
            style={styles.socialIcon}
            contentFit="contain"
          />
        }
      />
    </View>
  );
};

export default AuthButtons;

const styles = StyleSheet.create({
  socialBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  socialIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
  },
});
