import React, { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  ImageStyle,
  ImageBackground,
  TextStyle,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import { Screen, Header, Text, Navigate } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"
import { icons } from "../../components/icon/icons"
import { useIsFocused } from "@react-navigation/native"
import Carousel, { Pagination } from "react-native-snap-carousel"
import HTML from "react-native-render-html"
import FastImage from "react-native-fast-image"

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
  paddingTop: 13.3,
  paddingBottom: 34,
}
const DETAIL_VIEW: ViewStyle = {
  paddingTop: 26.7,
  flex: 1,
}
const TITLE: TextStyle = {
  paddingTop: 26.3,
  fontSize: 20,
  fontWeight: "bold",
}

const TEXT_SET: ViewStyle = {
  flex: 5,
  justifyContent: "flex-start",
  alignItems: "center",
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

export const MediaImageScreen = observer(function MediaImageScreen({ route }) {
  const swiper_ref = useRef()
  const [activeSLide, setActiveSlide] = useState<number>(0)
  const { mediaStore } = useStores()

  const isFocused = useIsFocused()

  const SLIDER_WIDTH = Dimensions.get("window").width
  const ITEM_WIDTH = SLIDER_WIDTH - 67
  useEffect(() => {
    if (isFocused) {
      getdata(route.params.id, route.params.parent_id)
    }
    return function cleanup() {
      mediaStore.subcategoryCleanup()
    }
  }, [route.params.id])

  const getdata = async (id: number, parentId) => {
    await mediaStore.subcategoryCleanup()
    await mediaStore.getSubCategoryItems(parentId)
    await mediaStore.getCurrentSubCategory(parentId)
    await mediaStore.getMediaForSubcategory(id, parentId)
    await mediaStore.getRecentData(parentId, id)
    mediaStore.setIndexForSubcategory(parentId)
  }

  const pagination = () => {
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
    // mediaStore.getRecentData(route.params.parent_id, route.params.id, item.id)
    return (
      <View key={index} style={DETAIL_VIEW}>
        <View style={{ flex: 5 }}>
          <FastImage
            source={{
              uri: item.url,
              priority: FastImage.priority.normal,
            }}
            style={{ height: "100%", width: "100%" }}
            resizeMode={FastImage.resizeMode.contain}
          />
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
          <View style={{ paddingHorizontal: 33.3 }}>
            <Navigate id={route.params.id} parent_id={route.params.parent_id} />
          </View>
          <View style={{ flex: 1 }}>
            {mediaStore.loading && (
              <ActivityIndicator color={color.palette.white} style={INDICATOR} />
            )}
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
