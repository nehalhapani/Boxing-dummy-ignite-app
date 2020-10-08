import * as React from "react"
import { View, ImageBackground, ImageStyle, StatusBar } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../theme"
import { icons } from "../icon/icons"

const BACKGROUND_IMAGE: ImageStyle = {
  height: "100%",
  width: "100%",
  resizeMode: "cover",
  backgroundColor: color.palette.black,
}

export interface BackgroundProps {
  style?: ImageStyle
  children?: React.ReactNode
}

/**
 * Describe your component here
 */
export const Background = observer(function Background(props: BackgroundProps) {
  return (
    <View>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <StatusBar barStyle="light-content" />
      <ImageBackground source={icons["backgroundImage"]} style={BACKGROUND_IMAGE}>
        {props.children}
      </ImageBackground>
    </View>
  )
})
