import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React from "react";


import { useTranslation } from "react-i18next";
import { fontStyles } from "@/style/generalStyles";
import { colors } from "@/styles/globalColors";

const TTS = ({
    tts,
    privacy,
    restore,
}: {
    tts: string;
    privacy: string;
    restore: () => void;
}) => {
    const openUrl = (url: string) => Linking.openURL(url);
    const { t } = useTranslation();
    return (
        <View style={styles.container}>

            {/* terms */}
            <TouchableOpacity onPress={() => tts && openUrl(tts)}>
                <Text style={styles.ttsText}>{t("paywall.tts")}</Text>
            </TouchableOpacity>

            {/* privacy */}
            <TouchableOpacity onPress={() => privacy && openUrl(privacy)}>
                <Text style={styles.ttsText}>{t("paywall.privacy")}</Text>
            </TouchableOpacity>


            {/* restore */}
            <TouchableOpacity onPress={restore}>
                <Text style={styles.ttsText}>{t("paywall.restore")}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TTS;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    ttsText: {
        ...fontStyles.small_text,
        color: colors.sub_title,
        textDecorationLine: "underline",
    },
});
