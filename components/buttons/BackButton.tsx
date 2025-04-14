import React from 'react'

import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity, StyleSheet } from 'react-native';

export default function BackButton() {
    return (
        <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => router.back()}
        >
            <Feather name="chevron-left" size={20} style={styles.icon} />
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#f4f4f4",
        justifyContent: "center",
    },
    icon: {
        margin: 15,
    },

});
