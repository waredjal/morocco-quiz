import { StyleSheet, TextInput, TextInputProps } from "react-native";
import React from "react";
import { colors } from "@/styles/globalColors";
import { fontStyles } from "@/style/generalStyles";



const Input = (props: TextInputProps) => {
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor={colors.gray}
            {...props}
        />
    );
};

export default Input;

const styles = StyleSheet.create({
    input: {
        ...fontStyles.label,
        height: 50,
        width: "100%",
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        color: colors.title,
        borderRadius: 15
    },
});
