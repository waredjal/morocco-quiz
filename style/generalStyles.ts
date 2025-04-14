import { colors } from "@/styles/globalColors";
import { StyleSheet } from "react-native";


export const generalStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.white,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    row_sp_bt: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    courseOption: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    line: {
        width: "100%",
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
    },
});

export const fontStyles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: colors.title,
        fontFamily: "Sora-Bold",
    },
    label: {
        fontSize: 16,
        color: colors.title,
        fontFamily: "Sora-SemiBold",
        lineHeight: 22,
    },
    small_title: {
        fontSize: 18,
        fontFamily: "Sora-Bold",
        color: colors.title,
    },
    normal: {
        fontSize: 14,
        fontFamily: "Sora-Regular",
        color: colors.title,
        lineHeight: 22,
    },
    headline: {
        fontSize: 26,
        fontFamily: "Sora-Bold",
        color: colors.title,
    },
    small_text: {
        fontSize: 12,
        fontFamily: "Sora-Regular",
        color: colors.title,
    },
    bold: {
        fontFamily: "Sora-Bold",
        color: colors.title,
    },
    semiBold: {
        fontFamily: "Sora-SemiBold",
        color: colors.title,
    },
});
