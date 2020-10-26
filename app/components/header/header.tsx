import React from "react"
import { View, ViewStyle, TextStyle, ImageStyle } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"
import { Icon } from "../icon/icon"
import { spacing, fontSize } from "../../theme"
import { translate } from "../../i18n/"
import { useNavigation, DrawerActions } from "@react-navigation/native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

/**
 * Static styles
 */
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: hp("3.7%"),
  alignItems: "center",
  paddingTop: spacing[4],
  paddingBottom: spacing[4],
  justifyContent: "flex-start",
  borderBottomWidth: 0.3,
  borderBottomColor: "rgba(255, 255, 255, 0.4)",
  zIndex: 1,
}
const LEFT_ICON: ImageStyle = {
  width: hp("2%"),
  height: hp("2.3%"),
}
const RIGHT_ICON: ImageStyle = {
  width: hp("3%"),
  height: hp("2%"),
}
const TITLE: TextStyle = {
  textAlign: "center",
  fontSize: fontSize.FONT_24Px,
}
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center" }
const LEFT: ViewStyle = { width: hp("5%") }
const RIGHT: ViewStyle = { width: hp("5%") }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  const { rightIcon, leftIcon, headerText, headerTx, style, titleStyle } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""

  return (
    <View style={{ ...ROOT, ...style }}>
      {leftIcon ? (
        <Button preset="link" onPress={() => goBack()}>
          <Icon icon={leftIcon} style={LEFT_ICON} />
        </Button>
      ) : (
        <View style={LEFT} />
      )}
      <View style={TITLE_MIDDLE}>
        <Text style={{ ...TITLE, ...titleStyle }} text={header} />
      </View>
      {rightIcon ? (
        <Button preset="link" onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Icon icon={rightIcon} style={RIGHT_ICON} />
        </Button>
      ) : (
        <View style={RIGHT} />
      )}
    </View>
  )
}
