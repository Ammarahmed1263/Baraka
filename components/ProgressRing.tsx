import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Colors from "@/constants/colors";

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;

  const ringColor = color || C.tint;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor + "20"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={[styles.percentage, { color: ringColor, fontFamily: "Inter_700Bold" }]}>
        {progress}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  percentage: { fontSize: 14 },
});
