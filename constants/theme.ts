/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// Modern, professional color palette
const tintColorLight = "#6366F1"; // Indigo - more modern than teal
const tintColorDark = "#818CF8"; // Lighter indigo for dark mode

export const Colors = {
  light: {
    text: "#1F2937", // Darker, better contrast
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#6B7280",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: tintColorLight,
    // New additions for better UI
    cardBackground: "#FFFFFF",
    border: "#E5E7EB",
    secondaryBackground: "#F9FAFB",
    success: "#10B981", // Green
    danger: "#EF4444", // Red
    placeholder: "#9CA3AF",
  },
  dark: {
    text: "#F9FAFB",
    background: "#111827", // Deeper dark
    tint: tintColorDark,
    icon: "#9CA3AF",
    tabIconDefault: "#6B7280",
    tabIconSelected: tintColorDark,
    // New additions for better UI
    cardBackground: "#1F2937",
    border: "#374151",
    secondaryBackground: "#1F2937",
    success: "#34D399",
    danger: "#F87171",
    placeholder: "#6B7280",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
