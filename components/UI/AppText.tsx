import { forwardRef } from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import Colors from '@/constants/colors';

type FontWeight = 'Light' | 'Regular' | 'Medium' | 'Bold';

interface AppTextProps extends TextProps {
  weight?: FontWeight;
}

export const AppText = forwardRef<Text, AppTextProps>(
  ({ weight = 'Regular', style, ...props }, ref) => {
    const isDark = useColorScheme() === 'dark';
    const C = isDark ? Colors.dark : Colors.light;
    const fontFamily = `Tajawal-${weight}`;

    return (
      <Text 
        ref={ref} 
        style={[{ fontFamily, color: C.text }, style]} 
        {...props} 
      />
    );
  }
);