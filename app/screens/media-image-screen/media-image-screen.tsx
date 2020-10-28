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
import { color, fontSize, typography, string } from "../../theme"
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
  paddingTop: hp("2.92%"),
  fontSize: fontSize.FONT_21Px,
  fontFamily: typography.fontBold,
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
  paddingHorizontal: hp("3.7%"),
}

/** use route parameters for access data send by previous screen */
interface MediaImageScreenProps {
  route
}

export const MediaImageScreen = observer(function MediaImageScreen({
  route,
}: MediaImageScreenProps) {
  const swiper_ref = useRef()
  const [activeSLide, setActiveSlide] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const { mediaStore } = useStores()
  const isFocused = useIsFocused()

  const SLIDER_WIDTH = Dimensions.get("window").width
  const ITEM_WIDTH = SLIDER_WIDTH - 67
  useEffect(() => {
    if (isFocused) {
      getdata(route.params.id, route.params.parent_id)
    }

    /** clean data for screen */
    return function cleanup() {
      mediaStore.subcategoryMediaCleanup()
    }
  }, [route.params.id, isFocused])

  const getdata = async (id: number, parentId) => {
    /** access subCategory detail from store by passing parentId */
    await mediaStore.getSubCategoryItems(parentId)

    /** access data for currently open subCategroy */
    await mediaStore.getCurrentSubCategory(parentId)

    /** access media array of subcategory */
    await mediaStore.getMediaForSubcategory(id, parentId)

    /** set currently open subcategory to recently viewed data array */
    await mediaStore.getRecentData(parentId, id)

    /** set currently open image slide id to store */
    await mediaStore.setViewdMediaArray(activeSLide + 1)

    /** set id of opened subcategory to store for drawer focused link */
    mediaStore.setIndexForSubcategory(parentId)
  }

  /** render pagination dots under image */
  const pagination = () => {
    return (
      <Pagination
        dotsLength={mediaStore.mediaArray.length}
        activeDotIndex={activeSLide}
        containerStyle={{ backgroundColor: color.transparent }}
        dotStyle={{
          height: hp("1.47%"),
          width: hp("1.47%"),
          borderRadius: hp("1.47%"),
          marginLeft: hp("1.77%"),
          backgroundColor: color.palette.angry,
        }}
        dotColor={color.palette.golden}
        inactiveDotColor={color.palette.white}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    )
  }

  /** render api response details in screen */
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
            onError={() => setImageError(true)}
          />
          {loading && !imageError && (
            <View style={INDICATOR}>
              <Text text={string.imageLoading} style={{ color: color.palette.golden }} />
              <Spinner type={"ThreeBounce"} color={color.palette.golden} />
            </View>
          )}
          {imageError && (
            <View style={INDICATOR}>
              <Text text={string.noInternet} style={{ color: color.palette.golden }} />
            </View>
          )}
        </View>
        <View style={TEXT_SET}>
          <Text text={item.caption} style={TITLE} />
          <HTML
            tagsStyles={{
              p: {
                color: "white",
                fontSize: fontSize.FONT_18Px,
                paddingTop: 16,
                fontFamily: typography.fontLight,
              },
            }}
            html={'<div style="color: white;">' + item.description + "</div>"}
          />
        </View>
      </View>
    )
  }

  return (
    <ImageBackground source={icons["backgroundImage"]} style={BACKGROUND}>
      <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
        {/* header component view */}
        <Header headerText={route.params.name} rightIcon="hamBurger" leftIcon="back" />
        <View style={MAIN_FLEX}>
          {/* prev/next button component view */}
          <View style={NAVIGATE_COMPONENT_PADDING}>
            <Navigate id={route.params.id} parent_id={route.params.parent_id} />
          </View>
          <View style={FLEX_STYLE_IMGDETAILVIEW}>
            {mediaStore.loading && (
              <View style={INDICATOR}>
                <Spinner type={"Bounce"} color={color.palette.golden} />
              </View>
            )}

            {/* swiper carousel for images */}
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

            {/* pagination dots for swiper */}
            {pagination()}
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})
