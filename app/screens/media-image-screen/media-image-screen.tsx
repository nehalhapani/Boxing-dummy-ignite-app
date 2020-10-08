import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  ImageStyle,
  ImageBackground,
  TextStyle,
  View,
  Image,
  TouchableOpacity,
} from "react-native"
import { Screen, Header, Icon, Text } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"
import { icons } from "../../components/icon/icons"
import { useIsFocused } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import Swiper from "react-native-swiper"
import HTML from "react-native-render-html"

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
const DETAIL_VIEW: ViewStyle = {
  paddingTop: spacing[5] + spacing[1],
  flex: 1,
}
const TITLE: TextStyle = {
  paddingTop: spacing[5] + spacing[1],
  fontSize: 20,
  fontWeight: "bold",
}
const PREV_BTN: ImageStyle = {
  width: 61.3,
  height: 26.7,
}
const DOTSTYLE_SWIPER: ImageStyle = {
  height: 13.3,
  width: 13.3,
  borderRadius: 13.3,
  marginLeft: spacing[4],
}
const IMG_SET: ImageStyle = {
  height: "100%",
  width: "100%",
  resizeMode: "contain",
}
const TEXT_SET: ViewStyle = {
  flex: 5,
  justifyContent: "flex-start",
  alignItems: "center",
}

export const MediaImageScreen = observer(function MediaImageScreen({ route }) {
  const { mediaStore } = useStores()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      console.tron.log("In useeffect")
      getdata(route.params.id)
    }
  }, [isFocused])

  const getdata = async (id: number) => {
    await mediaStore.getSubCategoryItems(route.params.parent_id)
    await mediaStore.getMediaForSubcategory(id)
    console.tron.log(mediaStore.mediaArray)
  }
  const renderview = mediaStore.mediaArray.media.map((item, key) => {
    return (
      <View style={DETAIL_VIEW}>
        <View style={{ flex: 5 }}>
          <Image source={{ uri: item.url }} style={IMG_SET} />
        </View>
        <View style={TEXT_SET}>
          <Text text={item.caption} style={TITLE} />
          <HTML html={'<div style="color: white; fontSize: 17">' + item.description + "</div>"} />
        </View>
      </View>
    )
  })
  //console.warn(mediaStore)

  return (
    <ImageBackground source={icons["backgroundImage"]} style={BACKGROUND}>
      <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
        <Header headerText={route.params.name} rightIcon="hamBurger" leftIcon="back" />
        <View style={MAIN_FLEX}>
          <View style={NAVIGATE_VIEW}>
            <View>
              <Icon icon={"prev2"} style={PREV_BTN} />
            </View>
            <View>
              <TouchableOpacity>
                <Icon icon={"next"} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Swiper
              showsButtons={false}
              loop={false}
              dotStyle={DOTSTYLE_SWIPER}
              activeDotStyle={DOTSTYLE_SWIPER}
              dotColor={color.palette.white}
              activeDotColor={color.palette.golden}
            >
              {renderview}
            </Swiper>
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})
