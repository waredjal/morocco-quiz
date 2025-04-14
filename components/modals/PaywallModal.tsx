import React from "react";
import { Modal, View, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import Premium from "@/app/premium";
import ViewContainer from "../layout/ViewContainer";

type PaywallModalProps = {
    visible: boolean;
    onClose: () => void;
};

const PaywallModal: React.FC<PaywallModalProps> = ({ visible, onClose }) => {
    return (
        <Modal animationType="fade" transparent visible={visible}>
            {/* <BlurView intensity={50} style={styles.overlay}> */}

            {/* <Pressable style={styles.backdrop} onPress={onClose} /> */}
            <Premium />
            {/* </BlurView> */}
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        borderRadius: 16,
        backgroundColor: "#fff",
    },
});

export default PaywallModal;
