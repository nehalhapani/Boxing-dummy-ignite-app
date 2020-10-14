import React, { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  ImageBackground,
  ImageStyle,
  View,
  TextStyle,
  Animated,
  FlatList,
  Dimensions,
} from "react-native"
import { Screen, Header, Text, Icon } from "../../components"
import { color } from "../../theme"
import { icons } from "../../components/icon/icons"
import { useStores } from "../../models"
import { useIsFocused } from "@react-navigation/native"
import Accordion from "react-native-collapsible/Accordion"
import FastImage from "react-native-fast-image"
import SearchInput, { createFilter } from "react-native-search-filter"
const KEYS_TO_FILTERS = ["title", "data"]
const VIEW_MAX_HEIGHT = 263
const VIEW_MIN_HEIGHT = 163
const SCROLL_DISTANCE = VIEW_MAX_HEIGHT - VIEW_MIN_HEIGHT
const WINDOW_WIDTH = Dimensions.get("window").width
const IMAGE_WIDTH = 116.7

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
  paddingHorizontal: 33.3,
  backgroundColor: "rgba(0,0,0,0.3)",
  flex: 1,
  paddingBottom: 30,
  marginTop: SCROLL_DISTANCE,
}
const ICON_STYLE: ImageStyle = {
  borderWidth: 3,
  borderColor: color.palette.golden,
  borderRadius: 116.7,
}
const PROFILE_NAME: TextStyle = {
  paddingVertical: 10,
  textAlign: "center",
  fontSize: 24,
  letterSpacing: 0.6,
  fontWeight: "500",
  color: color.palette.white,
  alignSelf: "flex-start",
}
const TEXT_IDENTITY: TextStyle = {
  fontSize: 17,
  letterSpacing: 0.43,
  textAlign: "center",
  color: color.palette.white,
  alignSelf: "flex-start",
}
const SAVED_CATEGORY: TextStyle = {
  fontSize: 20,
  color: color.palette.golden,
  paddingTop: 27,
  paddingBottom: 18,
}
const EMAIL_INPUT: TextStyle = {
  height: 40,
  borderColor: "gray",
  fontSize: 16,
  color: color.palette.white,
  borderBottomWidth: 1.5,
  borderStartColor: color.palette.white,
  width: "100%",
}
const SEARCH: ImageStyle = {
  position: "absolute",
  right: 0,
  top: 9,
}
const DIRECTION_ROW: ViewStyle = {
  flexDirection: "row",
}
const BUTTON_VIEW: ViewStyle = {
  marginTop: 16,
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
  paddingLeft: 17,
  paddingRight: 10,
  borderWidth: 1,
  borderColor: color.palette.white,
}
const ACTIVE_BUTTON_VIEW: ViewStyle = {
  ...BUTTON_VIEW,
  borderWidth: 0,
  backgroundColor: color.palette.golden,
}
const DOWNAERO: ImageStyle = {
  tintColor: color.palette.white,
  transform: [{ rotate: "180deg" }],
}
const ACTIVE_DOWNAERO: ImageStyle = {
  ...DOWNAERO,
  tintColor: color.palette.black,
  transform: [{ rotate: "360deg" }],
}
const SUBCATEGORY_MEDIATYPE: TextStyle = {
  paddingVertical: 16,
  fontSize: 16,
  textTransform: "uppercase",
}
const BUTTON_STYLE: TextStyle = {
  paddingVertical: 15,
  fontSize: 17,
  textTransform: "uppercase",
}
const ACTIVE_BUTTON_STYLE: TextStyle = {
  ...BUTTON_STYLE,
  color: color.palette.black,
  borderWidth: 0,
}
const SECOND_SUBCATEGORYVIEW: ViewStyle = {
  flexDirection: "row",
  paddingBottom: 6,
}

export const ProfileScreen = observer(function ProfileScreen() {
  const [activeSection, setActiveSection] = useState([])
  const { mediaStore, categoryStore } = useStores()
  const [recentlyViewedData, setRecentlyViewedData] = useState([])
  const [searchItem, setSearchItem] = useState("")
  const isFocused = useIsFocused()

  const scrollY = new Animated.Value(0)
  const translateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [VIEW_MAX_HEIGHT, VIEW_MIN_HEIGHT],
    extrapolate: "clamp",
  })
  const setProfileImg = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [WINDOW_WIDTH / 2 - IMAGE_WIDTH / 2, 33.3],
    extrapolate: "clamp",
  })
  const marginBottomProfileText = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, 10],
    extrapolate: "clamp",
  })
  const paddingTopForImage = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [31, 26.5],
    extrapolate: "clamp",
  })
  const topText = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [150, 35],
    extrapolate: "clamp",
  })
  const leftText = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, IMAGE_WIDTH + 50],
    extrapolate: "clamp",
  })
  const minWidth = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: ["100%", "0%"],
    extrapolate: "clamp",
  })

  useEffect(() => {
    if (isFocused) {
      getRecentData()
    }
  }, [isFocused])

  const getRecentData = () => {
    let recentlyViewedData = []
    categoryStore.category.forEach((element) => {
      mediaStore.recentData.forEach((recentItem) => {
        if (recentItem.parent_id == element.id) {
          recentlyViewedData.push({ title: element.name, content: recentItem.children })
        }
      })
    })
    setRecentlyViewedData(recentlyViewedData)
  }

  const renderHeader = (item, index, isExpanded) => {
    return (
      <View key={index} style={isExpanded ? ACTIVE_BUTTON_VIEW : BUTTON_VIEW}>
        <Text text={item.title} style={isExpanded ? ACTIVE_BUTTON_STYLE : BUTTON_STYLE} />
        <Icon icon={"downArrow"} style={isExpanded ? ACTIVE_DOWNAERO : DOWNAERO} />
      </View>
    )
  }

  const renderContent = (item, index) => {
    return (
      <View key={index}>
        {item.content.map((element, key) => {
          return (
            <View>
              <Text key={key} text={element.name} style={SUBCATEGORY_MEDIATYPE} />
              <FlatList
                data={element.media}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                ListEmptyComponent={() => {
                  return (
                    <View style={SECOND_SUBCATEGORYVIEW}>
                      <FastImage
                        source={{
                          uri: null,
                          priority: FastImage.priority.normal,
                        }}
                        style={{
                          marginRight: 16,
                          height: 64.7,
                          width: 64.3,
                          borderWidth: 2,
                          borderColor: color.palette.golden,
                          borderRadius: 64,
                          backgroundColor: "white",
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  )
                }}
                renderItem={({ item, index }: any) => {
                  return (
                    <View key={index} style={SECOND_SUBCATEGORYVIEW}>
                      <FastImage
                        source={{
                          uri: item.type == "Image" ? item.url : item.video_cover,
                          priority: FastImage.priority.normal,
                        }}
                        style={{
                          marginRight: 16,
                          height: 64.7,
                          width: 64.3,
                          borderWidth: 2,
                          borderColor: color.palette.golden,
                          borderRadius: 64,
                          backgroundColor: "white",
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  )
                }}
              />
            </View>
          )
        })}
      </View>
    )
  }
  const filteredData = recentlyViewedData.filter(createFilter(searchItem, KEYS_TO_FILTERS))
  return (
    <ImageBackground source={icons["backgroundImage"]} style={BACKGROUND}>
      <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
        <Header headerText={"Profile"} />
        <Animated.View
          style={{
            height: translateY,
            position: "absolute",
            top: 100,
            left: 0,
            right: 0,
          }}
        >
          <Animated.View
            style={{ position: "absolute", left: setProfileImg, paddingTop: paddingTopForImage }}
          >
            <Icon icon={"mainProfile"} style={ICON_STYLE} />
          </Animated.View>
          <Animated.View
            style={{
              position: "absolute",
              bottom: marginBottomProfileText,
              left: leftText,
              right: 0,
              top: topText,
            }}
          >
            <Animated.Text style={[PROFILE_NAME, { minWidth }]} numberOfLines={1}>
              {"Luke Johnson"}
            </Animated.Text>
            <Animated.Text style={[TEXT_IDENTITY, { minWidth }]} numberOfLines={1}>
              {"LukeMJohnson@gmail.com"}
            </Animated.Text>
            <Animated.Text style={[TEXT_IDENTITY, { minWidth }]} numberOfLines={1}>
              {"7th, March, 1986"}
            </Animated.Text>
          </Animated.View>
        </Animated.View>
        <View style={{ flexGrow: 1, marginTop: VIEW_MIN_HEIGHT }}>
          <Animated.ScrollView
            scrollEventThrottle={16}
            onScroll={(e) => {
              scrollY.setValue(e.nativeEvent.contentOffset.y)
            }}
          >
            <View style={MAIN_FLEX}>
              <Text text={"Saved Category"} style={SAVED_CATEGORY} />
              <View style={DIRECTION_ROW}>
                <SearchInput
                  style={EMAIL_INPUT}
                  inputViewStyles={EMAIL_INPUT}
                  placeholderTextColor={color.palette.brownGray}
                  placeholder={"Search categories"}
                  onChangeText={(searchItem) => setSearchItem(searchItem)}
                  fuzzy={true}
                />
                <Icon icon={"search"} style={SEARCH} />
              </View>
              <Accordion
                sections={filteredData}
                activeSections={activeSection}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={(activeSections) => setActiveSection(activeSections)}
              />
            </View>
          </Animated.ScrollView>
        </View>
      </Screen>
    </ImageBackground>
  )
})
