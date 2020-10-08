import React, { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  ImageStyle,
  ImageBackground,
  TextStyle,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native"
import { Screen, Header, Icon, Text } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"
import { icons } from "../../components/icon/icons"
import { useIsFocused } from "@react-navigation/native"
import Carousel, { Pagination } from "react-native-snap-carousel"
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
  paddingVertical: spacing[3] + spacing[2],
}
const NAVIGATE_VIEW: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: 33.3,
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
const DOTSTYLE_SWIPER: ViewStyle = {
  height: 13.3,
  width: 13.3,
  borderRadius: 13.3,
  marginLeft: spacing[4],
  backgroundColor: color.palette.white,
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

const SLIDER_WIDTH = Dimensions.get("window").width
const ITEM_WIDTH = SLIDER_WIDTH - 67

export const MediaImageScreen = observer(function MediaImageScreen({ route }) {
  const swiper_ref = useRef()
  const [activeSLide, setActiveSlide] = useState(1)
  const { mediaStore } = useStores()
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      console.tron.log("In useeffect")
      getdata(route.params.id, route.params.parent_id)
    }
    return function cleanup() {
      mediaStore.subcategoryCleanup()
      console.tron.log("In cleanup")
    }
  }, [isFocused])

  const getdata = async (id: number, parentId) => {
    console.log(id, parentId)
    await mediaStore.getSubCategoryItems(parentId)
    await mediaStore.getCurrentSubCategory(parentId)
    await mediaStore.getMediaForSubcategory(id)

    console.log("mediaArray", mediaStore.mediaArray)
  }

  const pagination = () => {
    // const { entries, activeSlide } = this.state
    return (
      <Pagination
        dotsLength={mediaStore.mediaArray.length}
        activeDotIndex={activeSLide}
        containerStyle={{ backgroundColor: color.transparent }}
        dotStyle={{
          height: 13.3,
          width: 13.3,
          borderRadius: 13.3,
          marginLeft: spacing[4],
          backgroundColor: color.palette.white,
        }}
        dotColor={color.palette.golden}
        inactiveDotColor={color.palette.white}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    )
  }
  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={DETAIL_VIEW}>
        <View style={{ flex: 5 }}>
          <Image source={{ uri: item.url }} style={IMG_SET} />
        </View>
        <View style={TEXT_SET}>
          <Text text={item.caption} style={TITLE} />
          <HTML html={'<div style="color: white; fontSize: 17">' + item.description + "</div>"} />
        </View>
      </View>
    )
  }

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
            <Carousel
              ref={swiper_ref}
              data={mediaStore.mediaArray}
              renderItem={renderItem}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              inactiveSlideOpacity={0}
              inactiveSlideShift={0}
              loop={false}
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            {pagination()}
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})
