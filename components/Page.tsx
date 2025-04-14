import { View, ViewStyle } from "react-native";
import React from "react";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { generalStyles } from "@/style/generalStyles";

type Props = {
  children: JSX.Element | JSX.Element[];
  style?: ViewStyle | ViewStyle[];
  useInsets?: boolean;
};

const Page = (props: Props) => {
  const { children, style } = props;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      {props.useInsets ? (
        <View style={[generalStyles.page, { paddingTop: insets.top }, style]}>
          {children}
        </View>
      ) : (
        <SafeAreaView style={generalStyles.page}>
          <View style={[generalStyles.page, style]}>{children}</View>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
};

export default Page;
