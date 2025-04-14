import { View, StyleSheet, ViewStyle } from 'react-native'
import React from 'react'

import { appleSignIn, googleSignIn, guestSignIn } from "@/api/auth";
import { isAndroid } from "@/utils/platform";
import { useRouter } from "expo-router";

import { IconButton } from "@/components/CustomButton";

import { useTranslation } from "react-i18next";
import useAppState from "@/utils/state/useStore";


export default function LoginButtons({ noGuest, containerStyle }: { noGuest: boolean, containerStyle?: ViewStyle }) {

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
            ?.then((c) => {
                console.log(`${type} signed in!`, c);
                initUser(c!);
                router.replace("../(tabs)/home");
            })
            .catch((e) => console.error(`cannot connect: ${e}`));
    };

    return (
        <View style={[styles.buttonContainer, containerStyle]}>
            <IconButton
                title={t("login.google")}
                backgroundColor="#4285F4"
                onPress={() => handleLogin("GOOGLE")}
                icon={require("../../assets/images/google-icon.png")}
            />
            {!noGuest && <IconButton
                title={t("login.guest")}
                backgroundColor="#DB4437"
                onPress={() => handleLogin("GUEST")}
            />}
            <IconButton
                title={t("login.apple")}
                backgroundColor="#79ad65"
                icon={require("../../assets/images/apple-icon.png")}
                onPress={() => handleLogin("APPLE")}
                disabled
            />
        </View>
    )
}

const styles = StyleSheet.create({

    buttonContainer: {
        width: "85%",
    }
});
