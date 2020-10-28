import React, { useEffect, useState, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ImageStyle, TextStyle, ImageBackground, View, FlatList } from "react-native"
import { useIsFocused } from "@react-navigation/native"

import YoutubePlayer, { InitialPlayerParams } from "react-native-youtube-iframe"
import Spinner from "react-native-spinkit"
import HTML from "react-native-render-html"

import { color, spacing, fontSize, typography, string } from "../../theme"
import { icons } from "../../components/icon/icons"
import { Screen, Header, Navigate, Text } from "../../components"
import { useStores } from "../../models"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { useNetInfo } from "@react-native-community/netinfo"

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
  paddingHorizontal: hp("3.7%"),
  paddingVertical: hp("1.44%"),
}
const VIDEO_VIEW: ViewStyle = {
  paddingTop: spacing[1],
}
const RENDER_VIEW: ViewStyle = {
  marginVertical: hp("1.78%"),
}
const STYLE_EMPTY_VIEW: ViewStyle = {
  flex: 1,
  justifyContent: "flex-end",
}
const STYLE_EMPTY_TEXT: TextStyle = {
  alignSelf: "center",
  fontSize: fontSize.FONT_16Px,
  fontFamily: typography.fontBold,
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
const NoInternet: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  height: hp("22.2%"),
}
const ERROR_TEXT_STYLE: TextStyle = {
  color: color.palette.golden,
}

interface VideoScreenProps {
  route
}

export const VideoScreen = observer(function VideoScreen({ route }: VideoScreenProps) {
  const { mediaStore } = useStores()
  const [loading, setLoading] = useState(true)
  const [videoPlay, setVideoPlay] = useState(false)
  const isFocused = useIsFocused()
  const [responseReceived, setResponseReceived] = useState(false)
  const netInfo = useNetInfo()

  useEffect(() => {
    /** get data of subCategory media */
    if (isFocused) {
      getdata(route.params.id, route.params.parent_id)
    }

    /** data cleanup for screen */
    return function cleanup() {
      mediaStore.subcategoryMediaCleanup()
    }
  }, [route.params.id, isFocused])

  // call when network connected or disconnected
  useEffect(() => {
    setLoading(true)
  }, [netInfo.isConnected])

  const getdata = async (id: number, parentId) => {
    /** get data of subCategory, currently opened subcategory , media details */
    await mediaStore.getSubCategoryItems(parentId)
    setResponseReceived(true)
    await mediaStore.getCurrentSubCategory(parentId)
    await mediaStore.getMediaForSubcategory(id, parentId)

    /** set id of open subcategory for apply drawer focused */
    mediaStore.setIndexForSubcategory(parentId)

    /** set open media details for visited recently viewed data */
    await mediaStore.getRecentData(parentId, id)
  }

  /** params for video */
  const videoParams: InitialPlayerParams = {
    controls: true,
    modestbranding: false,
    loop: false,
    rel: false,
  }

  /** on reach end of video - set video playing stop */
  const videoStateChange = useCallback((state) => {
    if (state === "ended") {
      setVideoPlay(false)
    }
  }, [])

  /** render video description from api */
  const renderItem = ({ item, index }) => {
    mediaStore.setViewdMediaArray(item.id)
    return (
      <View key={index} style={VIDEO_VIEW}>
        <HTML
          tagsStyles={{
            ul: { color: "white", fontSize: fontSize.FONT_16Px, fontFamily: typography.fontLight },
            p: {
              color: "white",
              fontSize: fontSize.FONT_16Px,
              paddingBottom: hp("1%"),
              fontFamily: typography.fontLight,
            },
            h2: {
              color: "white",
              fontSize: fontSize.FONT_22Px,
              fontFamily: typography.fontRegular,
            },
          }}
          listsPrefixesRenderers={{
            ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
              return <Text style={{ color: "white", marginRight: 5 }}>+</Text>
            },
          }}
          html={'<div style="color: white">' + item.description + "</div>"}
        />
      </View>
    )
  }

  /** render video in screen */
  const renderVideo = () => {
    if (!responseReceived) return null
    return mediaStore.mediaArray.map((item, index) => {
      /** extract video id from video link */
      let video_id = item.url.match(
        /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/,
      )[1]
      return (
        <View key={index} style={RENDER_VIEW}>
          {netInfo.isConnected && (
            <YoutubePlayer
              videoId={video_id}
              play={videoPlay}
              height={hp("22.2%")}
              initialPlayerParams={videoParams}
              onReady={() => setLoading(false)}
              onChangeState={videoStateChange}
            />
          )}

          {loading && netInfo.isConnected && (
            <View style={INDICATOR}>
              <Text text={string.videoLoading} style={ERROR_TEXT_STYLE} />
              <Spinner type={"ThreeBounce"} color={color.palette.golden} />
            </View>
          )}
          {!netInfo.isConnected && (
            <View style={NoInternet}>
              <Text text={string.noInternet} style={ERROR_TEXT_STYLE} />
            </View>
          )}
        </View>
      )
    })
  }

  return (
    <ImageBackground source={icons["backgroundImage"]} style={BACKGROUND}>
      <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
        {/* header component with screen name / back action / drawer icon */}
        <Header
          headerText={route.params.name}
          rightIcon="hamBurger"
          leftIcon="back"
          titleStyle={{ textTransform: "capitalize" }}
        />
        <View style={MAIN_FLEX}>
          {/* prev/next navigation component */}
          <Navigate id={route.params.id} parent_id={route.params.parent_id} />
          {mediaStore.loading && (
            <View style={INDICATOR}>
              <Spinner type={"Bounce"} color={color.palette.golden} />
            </View>
          )}

          {/* set message for empty media array */}
          {route.params.screenType == "None" && (
            <View style={STYLE_EMPTY_VIEW}>
              <Text text={string.notFound} style={STYLE_EMPTY_TEXT} />
            </View>
          )}

          {/* video render view */}
          {renderVideo()}

          {/* video description render view */}
          <FlatList
            data={mediaStore.mediaArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Screen>
    </ImageBackground>
  )
})
