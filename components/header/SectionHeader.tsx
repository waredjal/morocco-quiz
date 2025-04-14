import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BackButton from "../buttons/BackButton";

type Props = {
  title: string;
  btnRight?: boolean;
  noBackBtn?: boolean;
};

const SectionHeader = ({ title, btnRight, noBackBtn }: Props) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {!noBackBtn ? (
        <BackButton />
      ) : (
        <View style={btnRight && styles.offsetRight}></View>
      )}
      <Text style={styles.title}>{title}</Text>
      {btnRight ? (
        <TouchableOpacity style={styles.iconContainer}>
          <Entypo name="dots-three-vertical" size={20} style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <View style={!noBackBtn && styles.offsetLeft}></View>
      )}
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: '5%'
  },
  title: { fontWeight: "500", fontSize: 20 },
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
  offsetLeft: { paddingRight: 20 },
  offsetRight: { paddingLeft: 40 },
});
