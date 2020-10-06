import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ImageStyle, ImageBackground, TextStyle, View, FlatList } from "react-native"
import { Screen, Header, Button } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
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
const FIRST_FLEX: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}
export const HomeScreen = observer(function HomeScreen() {
  const navigation = useNavigation()
  const { categoryStore, mediaStore } = useStores()
  const isFocused = useIsFocused()

  useEffect(() => {
    categoryStore.getCategoryItems()
    mediaStore.setIndexForSubcategory(0)
  }, [isFocused])

  const renderItem = ({ item }) => {
    return (
      <View style={BUTTON}>
        <Button
          style={BUTTON_VIEW}
          textStyle={TEXT_COLOR}
          text={item.name}
          onPress={() =>
            navigation.navigate("prepare", {
              id: item.id,
              name: item.name,
            })
          }
        />
      </View>
    )
  }
  return (
    <ImageBackground source={require("./layer2.png")} style={BACKGROUND}>
      <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
        <Header headerText={"Dashboard"} rightIcon="hamBurger" />
        <View style={FIRST_FLEX}>
          <View style={MAIN_VIEW}>
            <FlatList
              data={categoryStore.category}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})