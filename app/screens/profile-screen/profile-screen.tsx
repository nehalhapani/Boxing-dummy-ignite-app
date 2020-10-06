import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ImageBackground, ImageStyle, View, TextStyle, TextInput } from "react-native"
import { Screen, Header, Text, Icon, Button } from "../../components"
import { color, spacing } from "../../theme"
import { icons } from "../../components/icon/icons"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
const BACKGROUND: ImageStyle = {
  flex: 1,
  backgroundColor: color.transparent,
  resizeMode: "cover",
}
const MAIN_FLEX: ViewStyle = {
  padding: 33.3,
}
const ICON_STYLE: ImageStyle = {
  borderWidth: 3,
  borderColor: color.palette.golden,
  borderRadius: 116.7,
}
const PROFILE_VIEW: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: 31,
  backgroundColor: "rgba(0,0,0,0.5)",
}
const PROFILE_NAME: TextStyle = {
  marginVertical: 13,
  marginTop: spacing[2],
  justifyContent: "center",
  alignItems: "center",
  fontSize: 24,
  letterSpacing: 0.6,
  fontWeight: "500",
}
const TEXT_IDENTITY: TextStyle = {
  fontSize: 17,
  letterSpacing: 0.43,
}
const SAVED_CATEGORY: TextStyle = {
  fontSize: 20,
  color: color.palette.golden,
  paddingVertical: spacing[4],
  paddingTop: spacing[2],
}
const EMAIL_INPUT: TextStyle = {
  height: 40,
  borderColor: "gray",
  fontSize: 16,
  color: color.palette.white,
  borderBottomWidth: 1.5,
  borderStartColor: color.palette.white,
  width: "100%",
}
const SEARCH: ImageStyle = {
  position: "absolute",
  right: 0,
  top: 8,
}
const SEARCH_VIEW: ViewStyle = {
  flexDirection: "row",
}
const BUTTON_VIEW: ViewStyle = {
  paddingVertical: spacing[4],
}
const BUTTON_TEXT: TextStyle = {
  color: color.palette.black,
  fontSize: 17,
  alignSelf: "flex-start",
}
const DOWNAERO: ImageStyle = {
  position: "absolute",
  right: 9,
  bottom: 16,
}

export const ProfileScreen = observer(function ProfileScreen() {
  return (
    <ImageBackground source={icons["backgroundImage"]} style={BACKGROUND}>
      <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
        <Header headerText={"Profile"} />
        <View style={MAIN_FLEX}>
          <View style={PROFILE_VIEW}>
            <Icon icon={"mainProfile"} style={ICON_STYLE} />
            <Text text={"Luke Johnson"} style={PROFILE_NAME} />
            <Text text={"LukeMJohnson@gmail.com"} style={TEXT_IDENTITY} />
            <Text text={"7th, March, 1986"} style={TEXT_IDENTITY} />
          </View>

          <Text text={"Saved Category"} style={SAVED_CATEGORY} />
          <View style={SEARCH_VIEW}>
            <TextInput
              style={EMAIL_INPUT}
              placeholder={"Search categories"}
              placeholderTextColor={color.palette.brownGray}
            />
            <Icon icon={"search"} style={SEARCH} />
          </View>
          <View style={BUTTON_VIEW}>
            <Button
              text={"PREPARE"}
              textStyle={BUTTON_TEXT}
              style={{ backgroundColor: color.palette.golden, paddingVertical: spacing[3] }}
            />
            <Icon icon={"downArrow"} style={DOWNAERO} />
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})
