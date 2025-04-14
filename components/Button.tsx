import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";
import React, { useEffect } from "react";
// import colors from "../styles/colors";
// import { fontStyles } from "../styles/generalStyles";
// import { isDarkColor } from "../utils/helpers";
import Animated, {
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
} from "react-native-reanimated";
import { fontStyles } from "@/style/generalStyles";
import { colors } from "@/styles/globalColors";

interface Props extends TouchableOpacityProps {
    title?: string;
    containerStyle?: ViewStyle;
    loading?: boolean;
    titleStyle?: TextStyle;
    tintColor?: string;
    isExerciseFinished?: boolean;
    withAnimation?: boolean;
    icon?: React.ReactElement;
}

const Button = (props: Props) => {

    const isDarkColor = () => false
    const containerStyle = {
        ...styles.container,
        ...props.containerStyle,
    };

    const tintColor = props.tintColor
    // ? props.tintColor
    // : isDarkColor(containerStyle.backgroundColor.toString())
    //     ? colors.white
    //     : undefined;

    const titleStyle = {
        ...styles.title,
        ...props.titleStyle,
        color: tintColor,
    };

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    useEffect(() => {
        if (props.isExerciseFinished) {
            scale.value = withRepeat(
                withSpring(1.1),
                2,
                true,
                () => { },
                ReduceMotion.System
            );
        }
    }, [props.isExerciseFinished]);

    const Content = React.useMemo(
        () => (
            <TouchableOpacity
                activeOpacity={0.7}
                style={containerStyle}
                {...props}
                disabled={props.disabled || props.loading}
            >
                {props.icon && props.icon}
                {props.loading ? (
                    <ActivityIndicator size="small" color={tintColor} />
                ) : (
                    <Text style={titleStyle}>{props.title}</Text>
                )}
            </TouchableOpacity>
        ),
        [containerStyle, props, tintColor, titleStyle]
    );

    if (props.withAnimation) {
        return <Animated.View style={animatedStyle}>{Content}</Animated.View>;
    } else {
        return Content;
    }
};

export default Button;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: colors.active,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    title: {
        ...fontStyles.label,
        color: colors.white,
        textTransform: "capitalize",
    },
});
