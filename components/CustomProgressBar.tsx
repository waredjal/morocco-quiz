import { View, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '@/styles/globalColors';

export default function CustomProgressBar({ progress, fillColor = colors.accent }: { progress: number, fillColor?: string }) {
    return (
        <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: fillColor }]} />
        </View>
    )
}

const styles = StyleSheet.create({

    progressBar: {
        width: "100%",
        height: 5,
        backgroundColor: "#f2f2f2",
        borderRadius: 5,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
    },
});


