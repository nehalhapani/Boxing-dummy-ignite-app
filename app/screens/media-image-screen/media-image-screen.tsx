import React, { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ImageStyle, ImageBackground, TextStyle, View, Dimensions } from "react-native"
import { useIsFocused } from "@react-navigation/native"

import Carousel, { Pagination } from "react-native-snap-carousel"
import HTML from "react-native-render-html"
import FastImage from "react-native-fast-image"
import Spinner from "react-native-spinkit"

import { icons } from "../../components/icon/icons"
import { Screen, Header, Text, Navigate } from "../../components"
import { useStores } from "../../models"
import { color, spacing, fontSize } from "../../theme"
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
const MAIN_FLEX: ViewStyle = {
  flex: 1,
  paddingTop: hp("1.47%"),
  paddingBottom: hp("3.77%"),
}
const DETAIL_VIEW: ViewStyle = {
  paddingTop: hp("2.97%"),
  flex: 1,
}
const TITLE: TextStyle = {
  paddingTop: 26.3,
  fontSize: fontSize.FONT_21Px,
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
const FLEX_STYLE_IMGVIEW: ViewStyle = {
  flex: 5,
}
const FLEX_STYLE_IMGDETAILVIEW: ViewStyle = {
  flex: 1,
}
const NAVIGATE_COMPONENT_PADDING: ViewStyle = {
  paddingHorizontal: 33.3,
}
interface MediaImageScreenProps {
  route
}

export const MediaImageScreen = observer(function MediaImageScreen({
  route,
}: MediaImageScreenProps) {
  const swiper_ref = useRef()
  const [activeSLide, setActiveSlide] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const { mediaStore } = useStores()
  const isFocused = useIsFocused()

  const SLIDER_WIDTH = Dimensions.get("window").width
  const ITEM_WIDTH = SLIDER_WIDTH - 67
  useEffect(() => {
    if (isFocused) {
      getdata(route.params.id, route.params.parent_id)
    }
    return function cleanup() {
      mediaStore.subcategoryMediaCleanup()
    }
  }, [route.params.id, isFocused])

  const getdata = async (id: number, parentId) => {
    await mediaStore.getSubCategoryItems(parentId)
    await mediaStore.getCurrentSubCategory(parentId)
    await mediaStore.getMediaForSubcategory(id, parentId)
    await mediaStore.getRecentData(parentId, id)
    await mediaStore.setViewdMediaArray(activeSLide + 1)
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
          backgroundColor: color.palette.angry,
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
        <View style={FLEX_STYLE_IMGVIEW}>
          <FastImage
            source={{
              uri: item.url,
              priority: FastImage.priority.normal,
            }}
            style={{ height: "100%", width: "100%" }}
            resizeMode={FastImage.resizeMode.contain}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {loading && (
            <View style={INDICATOR}>
              <Text text={"Image is loading..."} style={{ color: color.palette.golden }} />
              <Spinner type={"CircleFlip"} color={color.palette.golden} />
            </View>
          )}
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
          <View style={NAVIGATE_COMPONENT_PADDING}>
            <Navigate id={route.params.id} parent_id={route.params.parent_id} />
          </View>
          <View style={FLEX_STYLE_IMGDETAILVIEW}>
            {mediaStore.loading && (
              <View style={INDICATOR}>
                <Spinner type={"CircleFlip"} color={color.palette.golden} />
              </View>
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
              onSnapToItem={(index) => {
                setActiveSlide(index)
                mediaStore.setViewdMediaArray(index + 1)
              }}
            />
            {pagination()}
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})
