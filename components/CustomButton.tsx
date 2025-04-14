import { useRouter } from "expo-router";
import React from "react";
import {
  ColorValue,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { isAndroid } from "../utils/platform";
import ScoreProgress from "./progress/ScoreProgress";
import { colors } from "@/styles/globalColors";

type CustomButtonProps = {
  title: string;
  variant?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  outline?: boolean;
  icon?: React.ReactElement;
  progress?: number
};

export const CustomButton = ({
  title,
  variant = "secondary",
  onPress,
  disabled,
  style,
  textStyle,
  icon,
  progress,
  outline = false,
}: CustomButtonProps) => {
  const buttonBgStyle = () => {
    switch (variant) {
      case "primary":
        return buttonStyles.primaryButton;
      case "secondary":
        return buttonStyles.secondaryButton;
      case "success":
        return buttonStyles.successButton;
      default:
        return buttonStyles.secondaryButton;
    }
  };

  const buttonTextStyle = () => {
    switch (variant) {
      case "primary":
        return buttonStyles.primaryButtonText;
      case "secondary":
        return buttonStyles.secondaryButtonText;
      case "success":
        return buttonStyles.successButtonText;
      default:
        return buttonStyles.secondaryButtonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        buttonStyles.button,
        // buttonStyles.buttonShadow,
        buttonBgStyle(),
        outline && buttonStyles.buttonOutline,
        disabled && { opacity: 0.5 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <Text
        style={[buttonStyles.buttonText, buttonTextStyle(), textStyle]}
        adjustsFontSizeToFit
      >
        {title}
      </Text>
      {progress && progress < 100 && <ScoreProgress size={30} progress={progress} fillColor={colors.white} bgColor={colors.dark_success} />}
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: 15,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonShadow: isAndroid
    ? { elevation: 5 }
    : {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#ffe0e0",
  },
  primaryButton: {
    backgroundColor: "#E74C3C",
  },
  secondaryButton: {
    backgroundColor: "#FFF",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
  },
  primaryButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#000",
  },
  successButton: {
    backgroundColor: "#27b145",
  },
  successButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

type IconButtonProps = {
  title: string;
  backgroundColor: ColorValue;
  icon?: ImageSourcePropType;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: ImageStyle;
  onPress?: () => void;
  disabled?: boolean;
};

export const IconButton = ({
  title,
  backgroundColor,
  icon,
  containerStyle,
  textStyle,
  iconStyle,
  onPress,
  disabled,
}: IconButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[
        iconButtonStyles.button,
        { backgroundColor },
        icon
          ? iconButtonStyles.buttonWithIcon
          : iconButtonStyles.buttonWithoutIcon,
        disabled && iconButtonStyles.disabled,
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      touchSoundDisabled={disabled}
    >
      {icon && (
        <View style={iconButtonStyles.iconOutline}>
          <Image
            source={icon}
            style={[iconButtonStyles.icon, iconStyle]}
            resizeMode="contain"
          />
        </View>
      )}
      <Text style={[iconButtonStyles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const iconButtonStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonWithIcon: {
    paddingLeft: 15,
  },
  buttonWithoutIcon: {
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
    margin: "auto",
  },
  iconOutline: {
    borderRadius: 50,
    backgroundColor: "white",
    height: 50,
    width: 50,
    position: "absolute",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  disabled: { opacity: 0.6 },
});
