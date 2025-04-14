import {
    Modal,
    ModalProps,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
// import colors from "../../styles/colors";
// import { fontStyles, generalStyles } from "../../styles/generalStyles";
import { Ionicons } from "@expo/vector-icons";
;
import { purchasePackage } from "../../utils/InAppPurchaseController";
import * as Burnt from "burnt";
// import useAppState from "../../utils/state/useStore";
// import useHearts from "../../hooks/useHearts";
import { useTranslation } from "react-i18next";
import { useIAP } from "@/IAPContext";
import Button from "../Button";
import { fontStyles, generalStyles } from "@/style/generalStyles";
import { colors } from "@/styles/globalColors";
import { useHeartStore } from "@/utils/state/heartStore";
import useAppState from "@/utils/state/useStore";

interface Props extends ModalProps {
    hide: () => void;
    goToPremiumScreen: () => void;
    hideModal: () => void;
}

const Card = ({
    mainOffer,
    price,
    offer,
    onPress,
}: {
    mainOffer?: boolean;
    price?: string;
    offer: string;
    onPress: () => void;
}) => {
    const { t } = useTranslation();
    return (
        <TouchableOpacity
            style={mainOffer ? styles.mainOfferCard : styles.card}
            onPress={onPress}
        >
            {mainOffer && (
                <View style={styles.mainOfferBanner}>
                    <Text style={styles.superText}>PREMIUM</Text>
                </View>
            )}
            <View style={generalStyles.row}>
                <Ionicons
                    name={mainOffer ? "infinite" : "heart"}
                    size={30}
                    color={mainOffer ? colors.premium : colors.error}
                    style={{ marginRight: mainOffer ? 24 : 12 }}
                />
                <Text style={[{ flexShrink: 1 }, fontStyles.label]}>{offer}</Text>
            </View>
            {mainOffer ? (
                <View
                    style={{
                        position: "absolute",
                        right: 24,
                    }}
                >
                    <Text style={styles.mainOfferText} numberOfLines={2}>
                        {t("general.learn_more")}
                    </Text>
                </View>
            ) : (
                <Text style={fontStyles.normal}>{price}</Text>
            )}
        </TouchableOpacity>
    );
};

const NextFreeHeart = () => {
    const [numOfHours, setNumOfHours] = useState<number | null>(null);

    const { lastFreeHeartDate } = useHeartStore();
    const { _id } = useAppState()
    const { t } = useTranslation();

    useEffect(() => {
        const getNumOfHours = () => {
            const fourHoursInMs = 14400000;
            const nowInMs = Date.now();
            if (lastFreeHeartDate) {
                const timeSinceLastRefill = nowInMs - Number(lastFreeHeartDate);
                const timeLeftForRefill = fourHoursInMs - timeSinceLastRefill;
                // Check if there is time left foxr the next heart refill
                if (timeLeftForRefill > 0) {
                    // Convert timeLeftForRefill to a more readable format (hours)
                    const hoursLeft = Math.round(timeLeftForRefill / (60 * 60 * 1000));
                    setNumOfHours(hoursLeft);
                } else {
                    setNumOfHours(null);
                }
            }
        };
        getNumOfHours();
    }, [lastFreeHeartDate]);

    if (numOfHours === null) {
        return null;
    }

    return (
        <Text style={fontStyles.bold}>
            {t("refill_hearts.next_heart")}{" "}
            <Text style={{ color: colors.error }}>
                {numOfHours} {t("general.hours")}
            </Text>
        </Text>
    );
};

const RefillHearts = ({
    visible,
    hide,
    goToPremiumScreen,
    hideModal,
}: Props) => {
    const { refillHearts } = useHeartStore();
    const { t } = useTranslation();
    const { _id } = useAppState()
    // const { setShowLoader } = useAppState();

    const { offerings } = useIAP();


    const currentOffering = React.useMemo(
        () => offerings?.all?.refill,
        [offerings?.all?.refill]
    );

    const refillPrice =
        currentOffering?.availablePackages[0]?.product?.priceString;

    const buyHearts = React.useCallback(async () => {
        if (
            // __DEV__
            false
        ) {
            refillHearts(_id);
        } else if (currentOffering) {
            // setShowLoader(true); //TODO: implement
            await purchasePackage(
                currentOffering.availablePackages[0],
                async (customerInfo) => {
                    if (
                        typeof customerInfo.entitlements.active[
                        currentOffering.availablePackages[0]?.identifier
                        ] !== "undefined"
                    ) {
                        refillHearts(_id);
                        await Burnt.toast({
                            title: t("general.successful_operation"),
                            preset: "done",
                            duration: 2,
                        });
                        hideModal();
                    }
                }
            )
                .catch(error => console.log("error in purchasePackage===", error))
            // .finally(() => setShowLoader(false)); //TODO: implement
        }
    }, [currentOffering]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={hide}
        >
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={{ alignItems: "center", gap: 24 }}>
                        <View style={{ alignItems: "center", gap: 8 }}>
                            <Text style={fontStyles.small_title}>
                                {t("refill_hearts.run_out_of_hearts")}
                            </Text>
                            <Text style={styles.text}>{t(t("refill_hearts.text"))}</Text>
                        </View>
                        <NextFreeHeart />
                        <Card
                            offer={t("refill_hearts.unlimited")}
                            mainOffer
                            onPress={goToPremiumScreen}
                        />
                        <Card
                            offer={t("refill_hearts.refill")}
                            price={refillPrice}
                            onPress={buyHearts}
                        />
                    </View>
                    <Button
                        title={t("general.no_thanks")}
                        containerStyle={{ backgroundColor: colors.white }}
                        tintColor={colors.gray}
                        onPress={hide}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default RefillHearts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-end",
    },
    innerContainer: {
        backgroundColor: colors.white,
        padding: 24,
        width: "100%",
        minHeight: "55%",
        justifyContent: "space-around",
    },
    text: {
        ...fontStyles.normal,
        textAlign: "center",
    },
    card: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        alignItems: "center",
        paddingHorizontal: "5%",
        flexDirection: "row",
        width: "100%",
        columnGap: 24,
        height: 70,
        justifyContent: "space-between",
    },
    mainOfferCard: {
        borderWidth: 2,
        borderColor: colors.premium,
        borderRadius: 10,
        alignItems: "center",
        paddingHorizontal: 24,
        flexDirection: "row",
        width: "100%",
        columnGap: 24,
        height: 70,
        justifyContent: "space-between",
    },
    mainOfferBanner: {
        position: "absolute",
        top: -1,
        left: -1,
        backgroundColor: colors.premium,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 8,
        alignItems: "center",
        paddingVertical: 2,
        paddingHorizontal: 8,
    },
    superText: {
        ...fontStyles.small_text,
        ...fontStyles.bold,
        color: colors.white,
    },
    mainOfferText: {
        ...fontStyles.normal,
        color: colors.premium,
        maxWidth: 100,
        textTransform: "uppercase",
    },
});
