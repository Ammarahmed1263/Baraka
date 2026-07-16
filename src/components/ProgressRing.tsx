import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";

type Props = {
  percentage: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export default function ProgressRing({
  percentage,
  size = 72,
  color,
  strokeWidth = 6,
}: Props) {
  const { colors: C } = useTheme();

  const ringColor = color || C.tint;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.round(
    Math.min(Math.max(percentage * (percentage < 1.1 ? 100 : 1), 0), 100),
  );
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor + "20"}
          strokeWidth={strokeWidth}
          fill='none'
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill='none'
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <AppText weight='Bold' variant='body' style={{ color: ringColor }}>
        {progress}%
      </AppText>
    </View>
  );
}
