import { Platform } from "react-native"

/**
 * You can find a list of available fonts on both iOS and Android here:
 * https://github.com/react-native-training/react-native-fonts
 *
 * If you're interested in adding a custom font to your project,
 * check out the readme file in ./assets/fonts/ then come back here
 * and enter your new font name. Remember the Android font name
 * is probably different than iOS.
 * More on that here:
 * https://github.com/lendup/react-native-cross-platform-text
 *
 * The various styles of fonts are defined in the <Text /> component.
 */
export const typography = {
  /**
   * The primary font.  Used in most places.
   */
  fontRegular: Platform.select({ ios: "SFProText-Regular", android: "SFProText-Regular" }),
  fontBold: Platform.select({ ios: "SFProText-Bold", android: "SFProText-Bold" }),
  fontLight: Platform.select({ ios: "SFProText-Light", android: "SFProText-Light" }),
  fontSemibold: Platform.select({ ios: "SFProText-Semibold", android: "SFProText-Semibold" }),

  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: "Arial", android: "sans-serif" }),

  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: "Courier", android: "monospace" }),
}
