import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  ImageStyle,
  ImageBackground,
  TextStyle,
  View,
  FlatList,
  ActivityIndicator,
  BackHandler,
  Alert,
} from "react-native"
import { Screen, Header, Button } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color } from "../../theme"
import { useIsFocused } from "@react-navigation/native"
import { icons } from "../../components/icon/icons"

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
  // fontFamily: "SFProText-Regular",
}
const MAIN_VIEW: ViewStyle = {
  paddingHorizontal: 33.3,
}
const BUTTON_VIEW: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 21.3,
  backgroundColor: color.transparent,
  borderWidth: 1,
  borderColor: color.palette.white,
}
const BUTTON: ViewStyle = {
  paddingVertical: 8,
}
const FIRST_FLEX: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}
const INDICATOR: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
}

export const HomeScreen = observer(function HomeScreen() {
  const navigation = useNavigation()
  const { categoryStore, mediaStore } = useStores()
  const isFocused = useIsFocused()

  useEffect(() => {
    getCategoryData()
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ])
      return true
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

    return () => backHandler.remove()
  }, [isFocused])

  const getCategoryData = async () => {
    await categoryStore.getCategoryItems()
    await mediaStore.setIndexForSubcategory(0)
  }

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={BUTTON}>
        <Button
          style={BUTTON_VIEW}
          textStyle={TEXT_COLOR}
          text={item.name}
          onPress={() =>
            navigation.navigate("subCategory", {
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
        <Header headerText={"Dashboard"} rightIcon="hamBurger" />
        <View style={FIRST_FLEX}>
          <View style={MAIN_VIEW}>
            {categoryStore.loading && (
              <ActivityIndicator color={color.palette.white} style={INDICATOR} />
            )}
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
