import { Text, View } from "react-native";
import React, { useState } from "react";

import Button from "../Button";

import useAppState from "../../utils/state/useStore";
import { UserI } from "../../utils/types";

import { useTranslation } from "react-i18next";
import { useIAP } from "../../IAPContext";

import { router } from "expo-router";
import { fontStyles } from "@/style/generalStyles";
import { colors } from "@/styles/globalColors";
import { showToast } from "@/utils/Alert";
import Input from "../Input";
import { CustomButton } from "../CustomButton";


const EmailAuth = ({ type }: { type: "login" | "create" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const { isPremiumUser } = useIAP();

  // const { userData } = useAppState();

  const handleSubmit = async () => {
    // if (password.length < 6) {
    //   showToast(t("account.error"), "error");
    //   return;
    // }
    // if (email && password) {
    //   setLoading(true);
    //   try {
    //     if (type === "create") {
    //       const newUser: UserI = {
    //         ...userData,
    //         email,
    //         password,
    //         authType: LOGIN_TYPE.EMAIL,
    //       };
    //       await signUp(email, password, newUser);
    //       await createUser(newUser, isPremiumUser, () =>
    //         router.replace("/(tabs)/settings/account")
    //       );
    //     } else {
    //       await login(email, password);
    //       await getUser(email, LOGIN_TYPE.EMAIL, isPremiumUser, () =>
    //         router.replace("/(tabs)/settings/account")
    //       );
    //     }
    //   } catch (error) {
    //     console.error("handleSubmit", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // } else {
    //   alert(t("account.error"));
    // }
  };

  return (
    <View>
      <View style={{ rowGap: 16, width: "100%" }}>
        <Input
          placeholder="Email"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View>
          <Input
            placeholder={t("account.password")}
            secureTextEntry={true}
            onChangeText={setPassword}
          />
          <Text
            style={[
              fontStyles.label,
              {
                color: password.length < 6 ? colors.error : colors.success,
              },
            ]}
          >
            {password.split("").map((_, index) => (
              <Text key={index}>- </Text>
            ))}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 16 }}>
        <CustomButton
          title={
            type === "create" ? t("account.create_profile") : t("general.login")
          }
          style={{ backgroundColor: colors.accent }}
          textStyle={{ color: colors.white, fontSize: 18, fontWeight: 'bold' }}
          onPress={handleSubmit}
        />
        {/* <Button
          title={
            type === "create" ? t("account.create_profile") : t("general.login")
          }
          containerStyle={{ backgroundColor: colors.accent }}
          onPress={handleSubmit}
          loading={loading}
        /> */}
      </View>
    </View>
  );
};

export default EmailAuth;
