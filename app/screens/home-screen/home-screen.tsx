import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  ImageStyle,
  ImageBackground,
  TextStyle,
  View,
  FlatList,
  BackHandler,
  Alert,
} from "react-native"
import { useIsFocused } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"

import Spinner from "react-native-spinkit"

import { icons } from "../../components/icon/icons"
import { Screen, Header, Button, Text } from "../../components"
import { useStores } from "../../models"
import { color, fontSize, typography } from "../../theme"

import { heightPercentageToDP as hp } from "react-native-responsive-screen"

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
  fontSize: fontSize.FONT_16Px,
  letterSpacing: 3.07,
  fontFamily: "SFProText-Regular",
}
const MAIN_VIEW: ViewStyle = {
  paddingHorizontal: hp("3.7%"),
}
const BUTTON_VIEW: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: hp("2.36%"),
  backgroundColor: color.transparent,
  borderWidth: 1,
  borderColor: color.palette.white,
}
const BUTTON: ViewStyle = {
  paddingVertical: hp("0.89%"),
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
const STYLE_EMPTY_TEXT: TextStyle = {
  alignSelf: "center",
  fontSize: hp("2%"),
  fontFamily: typography.fontBold,
}
export const HomeScreen = observer(function HomeScreen() {
  const navigation = useNavigation()
  const { categoryStore, mediaStore } = useStores()
  const isFocused = useIsFocused()
  const [responseReceived, setResponseReceived] = useState(false)

  useEffect(() => {
    if (isFocused) {
      getCategoryData()
      BackHandler.addEventListener("hardwareBackPress", backAction)
    }

    return () => BackHandler.removeEventListener("hardwareBackPress", backAction)
  }, [isFocused])

  const getCategoryData = async () => {
    await categoryStore.getCategoryItems()
    setResponseReceived(true)
    await mediaStore.setIndexForSubcategory(0)
  }
  const backAction = () => {
    if (mediaStore.indexForSubcategory == 0) {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", style: "destructive", onPress: () => BackHandler.exitApp() },
      ])
    }
    return true
  }

  const renderItem = ({ item, index }) => {
    if (!responseReceived) return null
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

  const emptyListCategory = () => {
    if (!responseReceived) return null
    return (
      <View>
        <Text text={"Something went wrong ! Please try again later ."} style={[STYLE_EMPTY_TEXT]} />
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
              <View style={INDICATOR}>
                <Spinner type={"Bounce"} color={color.palette.golden} />
              </View>
            )}
            <FlatList
              data={categoryStore.category}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={emptyListCategory}
            />
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})
