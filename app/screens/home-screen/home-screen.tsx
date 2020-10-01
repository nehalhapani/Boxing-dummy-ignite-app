import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ImageStyle, ImageBackground, TextStyle, View, Alert } from "react-native"
import { Screen, Header, Button } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { useIsDrawerOpen } from "@react-navigation/drawer"

const ROOT: ViewStyle = {
  backgroundColor: color.transparent,
  flex: 1,
}
const BACKGROUND: ImageStyle = {
  flex: 1,
  backgroundColor: color.palette.black,
  resizeMode: "cover",
}
const TEXT_COLOR: TextStyle = {
  color: "#FEFEFE",
  fontSize: 15.3,
  letterSpacing: 3.07,
}
const MAIN_VIEW: ViewStyle = {
  paddingHorizontal: 33.3,
}
const BUTTON_VIEW: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 20.7,
  backgroundColor: color.transparent,
  borderWidth: 1,
  borderColor: color.palette.white,
}
const BUTTON: ViewStyle = {
  paddingVertical: spacing[2],
}

export const HomeScreen = observer(function HomeScreen() {
  // const navigation = useNavigation()
  // const isDrawerOpen = useIsDrawerOpen()
  const { authStore } = useStores()
  const logOut = () => {
    authStore.removeToken()
  }
  return (
    <ImageBackground source={require("./layer2.png")} style={BACKGROUND}>
      <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
        <Header
          headerText={"Dashboard"}
          rightIcon="hamBurger"
          onRightPress={() => Alert.alert("open Drawer")}
        />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={MAIN_VIEW}>
            <View style={BUTTON}>
              <Button style={BUTTON_VIEW} textStyle={TEXT_COLOR} text="PREPARE" />
            </View>
            <View style={BUTTON}>
              <Button style={BUTTON_VIEW} textStyle={TEXT_COLOR} text="LEARN" />
            </View>
            <View style={BUTTON}>
              <Button style={BUTTON_VIEW} textStyle={TEXT_COLOR} text="TRAIN" />
            </View>
            <View style={BUTTON}>
              <Button
                style={BUTTON_VIEW}
                textStyle={TEXT_COLOR}
                text="LOG OUT"
                onPress={() => logOut()}
              />
            </View>
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})
