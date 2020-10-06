import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ImageStyle, ImageBackground, View, TextStyle } from "react-native"
import { Screen, Header, Icon, Text } from "../../components"
import { color, spacing } from "../../theme"
import { icons } from "../../components/icon/icons"
import Video from "react-native-video"

const ROOT: ViewStyle = {
  backgroundColor: color.transparent,
  flex: 1,
}
const BACKGROUND: ImageStyle = {
  flex: 1,
  backgroundColor: color.palette.black,
  resizeMode: "cover",
}
const MAIN_FLEX: ViewStyle = {
  flex: 1,
  paddingHorizontal: 33.3,
  paddingVertical: spacing[3] + spacing[2],
}
const NAVIGATE_VIEW: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}
const PREV_BTN: ImageStyle = {
  width: 61.3,
  height: 26.7,
}
const VIDE_VIEW: ViewStyle = {
  paddingVertical: spacing[4] + spacing[1],
}
const SET_STYLE: TextStyle = {
  fontSize: 17,
  color: color.palette.white,
  fontWeight: "bold",
}

export const VideoScreen = observer(function VideoScreen({ route }) {
  return (
    <ImageBackground source={icons["backgroundImage"]} style={BACKGROUND}>
      <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
        <Header
          headerText={route.params.name}
          rightIcon="hamBurger"
          leftIcon="back"
          titleStyle={{ textTransform: "capitalize" }}
        />
        <View style={MAIN_FLEX}>
          <View style={NAVIGATE_VIEW}>
            <View>
              <Icon icon={"prev2"} style={PREV_BTN} />
            </View>
            <View>
              <Icon icon={"next"} />
            </View>
          </View>
          <View style={VIDE_VIEW}>
            <Text text={"SET 1"} style={SET_STYLE} />
            {/* <Video source={{ uri: "https://youtu.be/kq7fXo85ecU" }} /> */}
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})
