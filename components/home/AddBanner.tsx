import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewProps,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";


import { AdType } from "../../utils/types";
import { useTranslation } from "react-i18next";
import { useIAP } from "@/IAPContext";
import { colors } from "@/styles/globalColors";
import { shuffleArray } from "@/utils/utils";
import { useAdStore } from "@/utils/state/adStore";
import useAppState from "@/utils/state/useStore";

const AdBanner = (props: ViewProps) => {
    const router = useRouter();
    const { t } = useTranslation();

    const { isPremiumUser } = useIAP();

    const { language } = useAppState();
    const { ads } = useAdStore()

    // shuffles ads data and picks an ad randomly
    const randomAd: AdType = React.useMemo(
        () => shuffleArray(ads.filter((ad) => !!ad.img_url))[0]
        // language === "fr" // TODO: implement
        //     ? shuffleArray(ads.filter((ad) => !!ad.img_url))[0]
        //     : shuffleArray(
        //         ads.filter((ad) => !!ad[`img_url_${language}`] || ad?.img_url_en)
        //     )[0],
        , [ads, language]
    );

    const openPremiumScreen = () => {
        router.navigate({ pathname: "/premium", params: { from: "remove_ads" } });
    };

    const openLink = () => {
        Linking.openURL(randomAd?.go_to_url);
    };

    const imgUrl = React.useMemo(() => {
        return randomAd.img_url
        // return language === "fr" // TODO: implement
        //     ? randomAd.img_url
        //     : randomAd[`img_url_${language}`] || randomAd?.img_url_en;
    }, [language, randomAd]);

    if (isPremiumUser || !randomAd) {
        return null;
    }

    return (
        <View {...props}>
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 8
                }}
                onPress={openPremiumScreen}
            >
                <Ionicons name="close" size={13} color={colors.secondary_text} />
                <Text style={styles.smallText}>{t("general.remove_ads")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openLink}>
                <Image source={imgUrl} style={styles.bannerImg} contentFit="contain" />
            </TouchableOpacity>
        </View>
    );
};

export default React.memo(AdBanner);

const styles = StyleSheet.create({
    bannerImg: {
        alignSelf: "center",
        width: "100%",
        height: 50,
    },
    smallText: {
        // ...fontStyles.small_text,
        color: colors.secondary_text,
    },
});
