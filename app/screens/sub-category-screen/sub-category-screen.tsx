import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  ImageStyle,
  ImageBackground,
  TextStyle,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  BackHandler,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useIsFocused } from "@react-navigation/native"

import Spinner from "react-native-spinkit"

import { color, fontSize } from "../../theme"
import { icons } from "../../components/icon/icons"
import { Screen, Header, Text } from "../../components"
import { useStores } from "../../models"
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
  fontSize: fontSize.FONT_20Px,
  letterSpacing: 0.5,
  textTransform: "capitalize",
  alignSelf: "center",
  paddingLeft: hp("2%"),
}
const MAIN_VIEW: ViewStyle = {
  paddingHorizontal: 33.3,
}

const BUTTON: ViewStyle = {
  paddingVertical: hp("1.33%"),
  flexDirection: "row",
}
const ICON_STYLE: ImageStyle = {
  borderWidth: 3,
  borderColor: color.palette.golden,
  borderRadius: hp("7.45%"),
  height: hp("7.45%"),
  width: hp("7.45%"),
}
const VIEW_DIRECTION: ViewStyle = {
  flexDirection: "row",
}
const VIEW_ABOVE_MAIN: ViewStyle = {
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
interface SubCategoryScreenProps {
  route
}
export const SubCategoryScreen = observer(function SubCategoryScreen({
  route,
}: SubCategoryScreenProps) {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const { mediaStore } = useStores()

  useEffect(() => {
    if (isFocused) {
      getdata(route.params.id)
    }
    return () => mediaStore.subcategoryCleanup()
  }, [route.params.id, isFocused])

  const getdata = async (id: number) => {
    await mediaStore.getSubCategoryItems(id)
    await mediaStore.getCurrentSubCategory(id)
    await mediaStore.setIndexForSubcategory(id)
  }

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={BUTTON}>
        <TouchableOpacity
          style={VIEW_DIRECTION}
          onPress={() =>
            navigation.navigate(item.type == "Image" ? "image" : "video", {
              id: item.id,
              parent_id: item.parent_id,
              name: item.name,
              screenType: item.type,
            })
          }
        >
          <Image source={{ uri: item.icon }} style={ICON_STYLE} />
          <Text text={item.name} style={TEXT_COLOR} />
        </TouchableOpacity>
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
        <View style={VIEW_ABOVE_MAIN}>
          <View style={MAIN_VIEW}>
            {mediaStore.loading && (
              <View style={INDICATOR}>
                <Spinner type={"CircleFlip"} color={color.palette.golden} />
              </View>
            )}
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
