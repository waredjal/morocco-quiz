import { appleSignIn, googleSignIn, guestSignIn } from "@/api/auth";
import { isAndroid, isIOS } from "@/utils/platform";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "@/components/CustomButton";
import WaveShape from "@/components/onboarding/WaveShape";

import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/onboarding/LanguageSelector";
import useAppState from "@/utils/state/useStore";
import Page from "@/components/Page";
import ViewContainer from "@/components/layout/ViewContainer";

const Login = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { initUser } = useAppState.getState();

  const handleLogin = (type: string) => {
    let connection;
    switch (type) {
      case "GOOGLE":
        connection = googleSignIn();
        break;
      case "GUEST":
        connection = guestSignIn();
        break;
      case "APPLE":
        connection = appleSignIn();
        break;
    }
    connection
      ?.then((uid) => {
        console.log(`${type} signed in!`, uid);
        if (uid) {
          initUser(uid!);
          router.replace("../(tabs)/home");
        }
      })
      .catch((e) => console.error(`cannot connect: ${e}`));
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/login_bg.png")}
          style={styles.image}
          contentFit="cover"
        />
        <LanguageSelector />
        <WaveShape style={styles.wave} />
      </View>

      <Text style={styles.descriptionText}>{t("login.description")}</Text>

      <View style={styles.buttonContainer}>
        <IconButton
          title={t("login.google")}
          backgroundColor="#4285F4"
          onPress={() => handleLogin("GOOGLE")}
          icon={require("../../assets/images/google-icon.png")}
        />
        <IconButton
          title={t("login.guest")}
          backgroundColor="#DB4437"
          onPress={() => handleLogin("GUEST")}
        />
        {isIOS && <IconButton
          title={t("login.apple")}
          backgroundColor="#79ad65"
          icon={require("../../assets/images/apple-icon.png")}
          onPress={() => handleLogin("APPLE")}
        // disabled
        />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
    marginBottom: 40,
  },
  image: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  descriptionText: {
    fontSize: 24,
    textAlign: "center",
    marginHorizontal: 30,
    marginBottom: 40,
    color: "#333",
    lineHeight: 32,
  },
  buttonContainer: {
    width: "85%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 25,
    width: "100%",
  },
  buttonShadow: isAndroid
    ? { elevation: 5 }
    : {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  iconText: {
    fontSize: 20,
    marginRight: 10,
    color: "#FFF",
  },
  wave: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
});

export default Login;
