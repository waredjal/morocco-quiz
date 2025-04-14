import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { colors } from '@/styles/globalColors'

export default function ScoreProgress({
    progress,
    fillColor = colors.success,
    bgColor = colors.light_gray,
    size = 35,
}: {
    progress: number,
    fillColor?: string,
    bgColor?: string,
    size: number
}) {

    const styles = StyleSheet.create({
        progress: {
            position: 'absolute',
            color: progress == 0 ? colors.gray : fillColor,
            fontWeight: 'bold'
        }
    })

    return (
        <View style={{ justifyContent: 'center', alignItems: "center" }}>
            <AnimatedCircularProgress
                size={size}
                width={2}
                fill={progress}
                tintColor={fillColor}
                lineCap='round'
                backgroundColor={bgColor}
                style={{ borderRadius: 100 }}
            // style={{ position: 'absolute' }}
            />
            <Text style={styles.progress}>{progress}</Text>
        </View>
    )
}

