import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";

import useAppState from "@/utils/state/useStore";

import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { generalStyles } from "@/style/generalStyles";
import { colors } from "@/styles/globalColors";
import StyledText from "../StyledText";


const RootLoader = () => {
    const { showLoader } = useAppState();

    if (!showLoader?.visible) {
        return null;
    }

    return (
        <Animated.View
            entering={FadeInDown}
            exiting={FadeOutDown}
            style={styles.container}
        >
            <View style={styles.loader}>
                {showLoader?.text && <StyledText>{showLoader.text}</StyledText>}
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        </Animated.View>
    );
};

export default RootLoader;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        ...generalStyles.centerContent,
        position: "absolute",
        zIndex: 99999999,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    loader: {
        backgroundColor: colors.white,
        padding: 40,
        borderRadius: 12,
        gap: 24,
    },
});
