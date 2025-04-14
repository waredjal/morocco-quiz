import { ColorValue, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  width?: number | string;
  height?: number | string;
  fillColor?: ColorValue;
  style?: ViewStyle;
};

const WaveShape = ({
  width = "100%",
  height = 80,
  fillColor = "#FFF",
  style,
}: Props) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style={style}
    >
      <Path
        d="
          M-5,200 
          Q 350,-100 400,150 
          T600,270 
          T850,230 
          T1020,320 
          T1180,180 1440,190
          V350 H0"
        fill={fillColor}
      />
    </Svg>
  );
};

export default WaveShape;
