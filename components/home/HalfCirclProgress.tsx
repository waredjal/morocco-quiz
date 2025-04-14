import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/globalColors";
import { globalStyle } from "@/styles/globalStyles";

const HalfCircleProgress = ({ progress }: { progress: number }) => {
    const radius = 110; // Slightly increased to avoid clipping
    const angle = (progress / 100) * 180;
    const radians = (angle * Math.PI) / 180;

    // Calculate arrow position
    const arrowX = radius + (radius - 10) * Math.cos(radians - Math.PI);
    const arrowY = radius + (radius - 10) * Math.sin(radians - Math.PI);

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <AnimatedCircularProgress
                    size={radius * 2}
                    width={25}
                    fill={progress}
                    rotation={-90}
                    tintColor="#EEAD5C"
                    backgroundColor={colors.accent_surface}
                    arcSweepAngle={180}
                    lineCap="round"
                />
            </View>

            {/* Arrow Positioned at the Tip */}
            {/* <Animated.View
                style={[
                    styles.arrow,
                    globalStyle.shadowBox,
                    {
                        left: arrowX - 12,
                        top: arrowY - 12,
                        transform: [{ rotate: `${angle}deg` }],
                    },
                ]}
            >
                <MaterialIcons name="arrow-forward" size={24} color={colors.accent} style={{ backgroundColor: '#fff', borderRadius: 100 }} />
            </Animated.View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    container: {
        width: 220, // Increased width to prevent clipping
        height: 120, // Increased height slightly
        overflow: "visible", // Prevent arrow from being cut
        alignItems: "center",
    },
    arrow: {
        position: "absolute",
    },
});

export default HalfCircleProgress;
