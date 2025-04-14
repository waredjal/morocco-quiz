import { StyleSheet, Text, useWindowDimensions } from "react-native";
import React from "react";
import { StyledTextProps } from "@/utils/types";
import { colors } from "@/styles/globalColors";


const StyledText = ({
    type,
    textStyle,
    color,
    children,
    fontSize,
    shadow,
}: StyledTextProps) => {
    const { fontScale } = useWindowDimensions();

    const styles = StyleSheet.create({
        heading: {
            fontFamily: "Sora-Bold",
            fontSize: (fontSize || 20) * fontScale,
        },
        body: {
            fontFamily: "Sora-Regular",
            fontSize: (fontSize || 14) * fontScale,
            lineHeight: fontSize ? fontSize * 1.4 : 18,
        },
        semiBold: {
            fontFamily: "Sora-SemiBold",
            fontSize: (fontSize || 16) * fontScale,
            lineHeight: fontSize ? fontSize * 1.4 : 18,
        },
        shadow: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 3,
        },
    });

    return (
        <Text
            style={[
                { color: color || colors.title },
                type === "heading"
                    ? styles.heading
                    : type === "semiBold"
                        ? styles.semiBold
                        : styles.body,
                shadow ? styles.shadow : undefined,
                textStyle,
            ]}
        >
            {children}
        </Text>
    );
};

export default React.memo(StyledText);
