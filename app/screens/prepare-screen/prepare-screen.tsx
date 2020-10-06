import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import {
  ViewStyle,
  ImageStyle,
  ImageBackground,
  TextStyle,
  View,
  FlatList,
  Image,
} from "react-native"
import { Screen, Header, Button } from "../../components"
import { color, spacing } from "../../theme"
import { icons } from "../../components/icon/icons"
import { useStores } from "../../models"
import { useIsFocused } from "@react-navigation/native"

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
  fontSize: 20,
  letterSpacing: 0.5,
  textTransform: "capitalize",
}
const MAIN_VIEW: ViewStyle = {
  paddingHorizontal: 33.3,
}
const BUTTON_VIEW: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 20.7,
  backgroundColor: color.transparent,
}
const BUTTON: ViewStyle = {
  paddingVertical: spacing[5],
  flexDirection: "row",
}
const ICON_STYLE: ImageStyle = {
  borderWidth: 3,
  borderColor: color.palette.golden,
  borderRadius: 40,
  height: 67,
  width: 67,
}

export const PrepareScreen = observer(function PrepareScreen({ route }) {
  const navigation = useNavigation()
  console.log("navigation", navigation)
  const isFocused = useIsFocused()
  const { mediaStore } = useStores()
  useEffect(() => {
    mediaStore.getSubCategoryItems(route.params.id)
    mediaStore.setIndexForSubcategory(route.params.id)
  }, [route.params.id, isFocused])

  const renderItem = ({ item }) => {
    console.log("item ===>", item)

    return (
      <View style={BUTTON}>
        <Image source={{ uri: item.icon }} style={ICON_STYLE} />
        <Button
          style={BUTTON_VIEW}
          text={item.name}
          textStyle={TEXT_COLOR}
          onPress={() =>
            item.type == "Video"
              ? navigation.navigate("video", {
                  id: item.id,
                  name: item.name,
                })
              : navigation.navigate("gear", {
                  id: item.id,
                  name: item.name,
                })
          }
        />
      </View>
    )
  }
  return (
    <ImageBackground source={icons["backgroundImage"]} style={BACKGROUND}>
      <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
        <Header
          headerText={route.params.name}
          rightIcon="hamBurger"
          leftIcon="back"
          titleStyle={{ textTransform: "capitalize" }}
        />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={MAIN_VIEW}>
            <FlatList
              data={mediaStore.subCategory}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})