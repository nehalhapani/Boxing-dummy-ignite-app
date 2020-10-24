import { Platform } from "react-native"

import { widthPercentageToDP as wp } from "react-native-responsive-screen"
export const fontSize = {
  FONT_40Px: wp("11%"),
  FONT_30Px: wp("8%"),
  FONT_24Px: Platform.OS == "ios" ? wp("6%") : wp("5.7%"),
  FONT_22Px: wp("4.8%"),
  FONT_21Px: wp("4.51%"),
  FONT_20Px: wp("4.3%"),

  FONT_18Px: wp("4.0%"),
  FONT_16Px: wp("3.8%"),
  FONT_15Px: wp("3.56%"),
  FONT_12Px: wp("3.2%"),

  //   FONT_40Px: Platform.OS == "android" ? wp("11%") : wp("8.2%"),
  //   FONT_30Px: Platform.OS == "android" ? wp("8.2%") : wp("7.25%"),
  //   FONT_24Px: Platform.OS == "android" ? wp("6%") : wp("5.8%"),

  // FONT_22Px: !constants.isAndroid ? wp('4.8%') : wp('4.4%'),
  //   FONT_20Px: Platform.OS == "android" ? wp("4.3%") : wp("4.8%"),

  //   FONT_21Px: Platform.OS == "android" ? wp("4.51%") : wp("4.30%"),

  //   FONT_18Px: Platform.OS == "android" ? wp("4.0%") : wp("4%"),
  //   FONT_16Px: Platform.OS == "android" ? wp("3.8%") : wp("4%"),
  //   FONT_15Px: Platform.OS == "android" ? wp("3.56") : wp("3.28"),
  //   FONT_12Px: Platform.OS == "android" ? wp("3.2%") : wp("2.9%"),
  // FONT_14Px: !constants.isAndroid ? wp('3.6%') : wp('3.3%'),
  // FONT_10Px: !constants.isAndroid ? wp('2.7%') : wp('2.5%'),
}
