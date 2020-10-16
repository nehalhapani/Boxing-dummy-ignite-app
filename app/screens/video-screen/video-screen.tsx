import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  ImageStyle,
  ImageBackground,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { Screen, Header, Navigate, Text } from "../../components"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { icons } from "../../components/icon/icons"
import { useIsFocused } from "@react-navigation/native"
import YouTube from "react-native-youtube"
import Spinner from "react-native-spinkit"
import HTML from "react-native-render-html"
import { load } from "../../utils/storage"

const WINDOW_WIDTH = Dimensions.get("window").width

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
const VIDEO: ViewStyle = {
  alignSelf: "stretch",
  height: 200,
  width: "100%",
  backgroundColor: "white",
}
const RENDER_VIEW: ViewStyle = {
  marginVertical: spacing[4],
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

export const VideoScreen = observer(function VideoScreen({ route }) {
  const { mediaStore } = useStores()
  const [loading, setLoading] = useState(true)
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      getdata(route.params.id, route.params.parent_id)
    }
    return function cleanup() {
      mediaStore.subcategoryCleanup()
    }
  }, [route.params.id])
  const getdata = async (id: number, parentId) => {
    await mediaStore.getSubCategoryItems(parentId)
    await mediaStore.getCurrentSubCategory(parentId)
    await mediaStore.getMediaForSubcategory(id, parentId)
    mediaStore.setIndexForSubcategory(parentId)

    await mediaStore.getRecentData(parentId, id)
  }

  const renderItem = ({ item, index }) => {
    let video_id = item.url.match(
      /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/,
    )[1]
    return (
      <View key={index} style={VIDEO_VIEW}>
        <View style={RENDER_VIEW}>
          <YouTube
            apiKey={"AIzaSyCZM0JNm3Hwoa25ZYqyGjw7gX6rY3cHDYM"}
            videoId={video_id}
            play={false}
            fullscreen={false}
            loop={false}
            controls={1}
            modestbranding={true}
            style={VIDEO}
            onReady={() => setLoading(false)}
            onChangeState={() => setLoading(false)}
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
