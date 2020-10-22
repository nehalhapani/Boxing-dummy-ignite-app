import React, { useEffect, useState, useCallback } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  ImageStyle,
  TextStyle,
  ImageBackground,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useIsFocused } from "@react-navigation/native"

import YoutubePlayer, { InitialPlayerParams } from "react-native-youtube-iframe"
import Spinner from "react-native-spinkit"
import HTML from "react-native-render-html"

import { color, spacing } from "../../theme"
import { icons } from "../../components/icon/icons"
import { Screen, Header, Navigate, Text } from "../../components"
import { useStores } from "../../models"

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
  paddingVertical: 13,
}
const VIDEO_VIEW: ViewStyle = {
  paddingTop: spacing[1],
}
const RENDER_VIEW: ViewStyle = {
  marginVertical: spacing[4],
}
const STYLE_EMPTY_VIEW: ViewStyle = {
  flex: 1,
  justifyContent: "flex-end",
}
const STYLE_EMPTY_TEXT: TextStyle = {
  alignSelf: "center",
  fontSize: 16,
  fontWeight: "bold",
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

interface VideoScreenProps {
  route
}

export const VideoScreen = observer(function VideoScreen({ route }: VideoScreenProps) {
  const { mediaStore } = useStores()
  const [loading, setLoading] = useState(true)
  const [videoPlay, setVideoPlay] = useState(false)
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      getdata(route.params.id, route.params.parent_id)
    }
    return function cleanup() {
      mediaStore.subcategoryCleanup()
    }
  }, [route.params.id, isFocused])
  const getdata = async (id: number, parentId) => {
    await mediaStore.getSubCategoryItems(parentId)
    await mediaStore.getCurrentSubCategory(parentId)
    await mediaStore.getMediaForSubcategory(id, parentId)
    mediaStore.setIndexForSubcategory(parentId)
    await mediaStore.getRecentData(parentId, id)
  }

  const videoParams: InitialPlayerParams = {
    controls: true,
    modestbranding: false,
    loop: false,
    rel: false,
  }
  const videoStateChange = useCallback((state) => {
    if (state === "ended") {
      setVideoPlay(false)
    }
  }, [])
  const renderItem = ({ item, index }) => {
    mediaStore.setViewdMediaArray(item.id)

    let video_id = item.url.match(
      /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/,
    )[1]
    return (
      <View key={index} style={VIDEO_VIEW}>
        <View style={RENDER_VIEW}>
          <YoutubePlayer
            videoId={video_id}
            play={videoPlay}
            height={200}
            initialPlayerParams={videoParams}
            onReady={() => setLoading(false)}
            onChangeState={videoStateChange}
          />
          {loading && (
            <View style={INDICATOR}>
              <Text text={"Video is loading..."} style={{ color: color.palette.golden }} />
              <Spinner type={"CircleFlip"} color={color.palette.golden} />
            </View>
          )}
        </View>
        <HTML
          tagsStyles={{
            ul: { color: "white", fontSize: 16 },
            p: { color: "white", fontSize: 16, paddingBottom: 10 },
            h2: { color: "white" },
          }}
          listsPrefixesRenderers={{
            ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
              return <Text style={{ color: "white", fontSize: 16, marginRight: 5 }}>+</Text>
            },
          }}
          html={'<div style="color: white">' + item.description + "</div>"}
        />
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
        <View style={MAIN_FLEX}>
          <Navigate id={route.params.id} parent_id={route.params.parent_id} />
          {mediaStore.loading && (
            <ActivityIndicator color={color.palette.white} style={INDICATOR} />
          )}
          {route.params.screenType == "None" && (
            <View style={STYLE_EMPTY_VIEW}>
              <Text text={"No Data Found !"} style={STYLE_EMPTY_TEXT} />
            </View>
          )}
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
