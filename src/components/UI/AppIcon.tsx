import React from 'react';
import { I18nManager, StyleProp, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

export type FeatherIconName = keyof typeof Feather.glyphMap;

interface AppIconProps {
  name: FeatherIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  flipRTL?: boolean;
}

export function AppIcon({
  name,
  size = 24,
  color,
  style,
  flipRTL = false,
  ...props
}: AppIconProps) {
  const needsFlip = flipRTL && I18nManager.isRTL;

  return (
    <Feather
      name={name}
      size={size}
      color={color}
      style={[needsFlip && { transform: [{ scaleX: -1 }] }, style]}
      {...props}
    />
  );
}
