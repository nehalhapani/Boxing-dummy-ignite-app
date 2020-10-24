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
  Platform,
  TouchableOpacity,
  Alert,
  TextInput,
  NativeModules,
} from "react-native"
import { useIsFocused } from "@react-navigation/native"

import Accordion from "react-native-collapsible/Accordion"
import FastImage from "react-native-fast-image"
import Spinner from "react-native-spinkit"

import { createFilter } from "react-native-search-filter"
import { color, fontSize } from "../../theme"
import { icons } from "../../components/icon/icons"
import { Screen, Header, Text, Icon } from "../../components"
import { useStores } from "../../models"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

const VIEW_MAX_HEIGHT = 263
const VIEW_MIN_HEIGHT = 163
const SCROLL_DISTANCE = VIEW_MAX_HEIGHT - VIEW_MIN_HEIGHT
const WINDOW_WIDTH = Dimensions.get("window").width
const WINDOW_HEIGHT = Dimensions.get("window").height
const IMAGE_WIDTH = 116.7
const { StatusBarManager } = NativeModules
const MAIN: ViewStyle = {
  flex: 1,
}
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
  minHeight:
    WINDOW_HEIGHT - SCROLL_DISTANCE - 56 - WINDOW_HEIGHT * 0.103 - StatusBarManager.HEIGHT - 50,
  backgroundColor: "rgba(0,0,0,0.3)",
  paddingBottom: 27,
  marginTop: SCROLL_DISTANCE,
}
const PROFILE_NAME: TextStyle = {
  paddingVertical: hp("1.11%"),
  textAlign: "center",
  fontSize: fontSize.FONT_24Px,
  letterSpacing: 0.6,
  fontWeight: "500",
  color: color.palette.white,
  alignSelf: "flex-start",
  textTransform: "capitalize",
}
const TEXT_IDENTITY: TextStyle = {
  fontSize: fontSize.FONT_16Px,
  letterSpacing: 0.43,
  textAlign: "center",
  color: color.palette.white,
  alignSelf: "flex-start",
}
const SAVED_CATEGORY: TextStyle = {
  fontSize: fontSize.FONT_20Px,
  color: color.palette.golden,
  paddingTop: hp("3%"),
  paddingBottom: hp("2%"),
}
const SEARCH_INPUT: TextStyle = {
  height: hp("5%"),
  borderColor: "gray",
  fontSize: fontSize.FONT_18Px,
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
  marginTop: hp("1.78%"),
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
  paddingVertical: hp("1.78%"),
  fontSize: fontSize.FONT_16Px,
  textTransform: "uppercase",
}
const BUTTON_STYLE: TextStyle = {
  paddingVertical: hp("1.67%"),
  fontSize: fontSize.FONT_18Px,
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
const INDICATOR: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
}
const DELETE_IMAGE: ImageStyle = {
  position: "absolute",
  right: 0,
  top: 0,
  zIndex: 1,
  padding: 5,
  backgroundColor: color.palette.angry,
  borderRadius: 9,
}
const ICON_DELETE: ImageStyle = {
  height: 10,
  width: 10,
}
const TEXT_EMPLTY_ELEMENT: TextStyle = {
  textAlign: "left",
  paddingTop: 2,
  padding: 10,
}
const VIEW_MARGIN_IMG: TextStyle = {
  marginRight: hp("1.78%"),
}

export const ProfileScreen = observer(function ProfileScreen() {
  const [activeSection, setActiveSection] = useState([])
  const { mediaStore, categoryStore, authStore } = useStores()
  const [recentlyViewedData, setRecentlyViewedData] = useState([])
  const [toggle, setToggle] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [filterData, setFilterData] = useState([])

  const isFocused = useIsFocused()
  const KEYS_TO_FILTERS = ["title"]

  const scrollY = new Animated.Value(0)
  const translateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [VIEW_MAX_HEIGHT, VIEW_MIN_HEIGHT],
    extrapolate: "clamp",
  })
  const setProfileImg = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [(WINDOW_WIDTH - IMAGE_WIDTH) / 2, 33.3],
    extrapolate: "clamp",
  })
  const marginBottomProfileText = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, 10],
    extrapolate: "clamp",
  })
  const paddingTopForImage = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [30, (VIEW_MIN_HEIGHT - IMAGE_WIDTH) / 2],
    extrapolate: "clamp",
  })
  const topText = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [150, 30],
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
    return function cleanup() {
      setSearchText("")
    }
  }, [isFocused, toggle])

  const getRecentData = () => {
    let recentlyViewedData = []
    categoryStore.category.forEach((element) => {
      mediaStore.recentData.forEach((recentItem) => {
        if (recentItem.parent_id == element.id) {
          let seenMediaArray = []
          recentItem.children.forEach((recentMediaElement) => {
            let mediaChildren = recentMediaElement.media.filter((item) => {
              return mediaStore.seenMedia.indexOf(item.id) > -1
            })
            let dataOfChildMedia = recentMediaElement
            if (mediaChildren.length != 0) {
              dataOfChildMedia.media = mediaChildren
              seenMediaArray.push(dataOfChildMedia)
            }
          })
          recentlyViewedData.push({ title: element.name, content: seenMediaArray })
        }
      })
    })
    setRecentlyViewedData(recentlyViewedData)
    setFilterData(recentlyViewedData)
  }
  const renderHeader = (item, index, isExpanded) => {
    return (
      <View key={index} style={isExpanded ? ACTIVE_BUTTON_VIEW : BUTTON_VIEW}>
        <Text text={item.title} style={isExpanded ? ACTIVE_BUTTON_STYLE : BUTTON_STYLE} />
        <Icon icon={"downArrow"} style={isExpanded ? ACTIVE_DOWNAERO : DOWNAERO} />
      </View>
    )
  }

  const removeItemConfirmation = (mediaId) => {
    Alert.alert("DELETE", "Are you want to delete this item ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          removeItem(mediaId)
          setToggle(!toggle)
        },
        style: "destructive",
      },
    ])
  }
  const removeItem = (mediaId) => {
    mediaStore.removeViewedMediaArray(mediaId)
  }
  const searchAction = (searchItem) => {
    setSearchText(searchItem)
    if (searchItem == "") {
      setFilterData(recentlyViewedData)
    } else {
      const KEYS = ["content.name"]
      var filteredData = recentlyViewedData.filter(createFilter(searchItem, KEYS_TO_FILTERS))
      setActiveSection([0])

      if (filteredData.length == 0) {
        let temp = recentlyViewedData.filter(createFilter(searchItem, KEYS))
        let newMedia = temp.map((item) => {
          return {
            ...item,
            content: item.content.filter((element) =>
              element.name.toString().toLowerCase().includes(searchItem.toLowerCase()),
            ),
          }
        })
        filteredData = newMedia
        setActiveSection([0])
        setFilterData(filteredData)
      } else {
        setFilterData(filteredData)
      }
    }
  }

  const renderContent = (data, index) => {
    {
      if (data.content.length == 0) {
        return <Text text="No Data Found!" style={TEXT_EMPLTY_ELEMENT} />
      }
    }
    return (
      <View key={index}>
        {data.content.map((element, key) => {
          return (
            <View>
              <Text key={key} text={element.name} style={SUBCATEGORY_MEDIATYPE} />
              <FlatList
                data={element.media}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                ListEmptyComponent={(item, index) => {
                  return (
                    <TouchableOpacity style={VIEW_MARGIN_IMG}>
                      <TouchableOpacity
                        style={DELETE_IMAGE}
                        onPress={() => {
                          removeItemConfirmation(item.id)
                        }}
                      >
                        <Icon icon="delete" style={ICON_DELETE} />
                      </TouchableOpacity>
                      <View style={SECOND_SUBCATEGORYVIEW}>
                        <FastImage
                          source={{
                            uri: null,
                            priority: FastImage.priority.normal,
                          }}
                          style={{
                            height: hp("7.18%"),
                            width: hp("7.18%"),
                            borderWidth: 2,
                            borderColor: color.palette.golden,
                            borderRadius: IMAGE_WIDTH / 2,
                            backgroundColor: "white",
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      </View>
                    </TouchableOpacity>
                  )
                }}
                renderItem={({ item, index }: any) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={VIEW_MARGIN_IMG}
                      // onPress={() => {
                      //   mediaStore.subcategoryCleanup()
                      //   navigation.dispatch(
                      //     CommonActions.navigate(element.type == "Image" ? "image" : "video", {
                      //       id: element.id,
                      //       parent_id: element.parent_id,
                      //       name: element.name,
                      //       screenType: element.type,
                      //     }),
                      //   )
                      // }}
                    >
                      <TouchableOpacity
                        style={DELETE_IMAGE}
                        onPress={() => {
                          removeItemConfirmation(item.id)
                        }}
                      >
                        <Icon icon="delete" style={ICON_DELETE} />
                      </TouchableOpacity>
                      <View>
                        <FastImage
                          source={{
                            uri: item.type == "Image" ? item.url : item.video_cover,
                            priority: FastImage.priority.normal,
                          }}
                          style={{
                            height: hp("7.18%"),
                            width: hp("7.18%"),
                            borderWidth: 2,
                            borderRadius: IMAGE_WIDTH / 2,
                            borderColor: color.palette.golden,
                            backgroundColor: "white",
                            zIndex: 0,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      </View>
                    </TouchableOpacity>
                  )
                }}
              />
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <View style={MAIN}>
      <ImageBackground source={icons["backgroundImage"]} style={BACKGROUND}>
        <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
          <Header headerText={"Profile"} />
          {mediaStore.loading && (
            <View style={INDICATOR}>
              <Spinner type={"CircleFlip"} color={color.palette.golden} />
            </View>
          )}
          <Animated.View
            style={{
              height: translateY,
              position: "absolute",
              top: Platform.OS == "ios" ? 100 : 65,
              left: 0,
              right: 0,
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                left: setProfileImg,
                top: paddingTopForImage,
              }}
            >
              <FastImage
                source={
                  authStore.userData == ""
                    ? icons.profile
                    : { uri: authStore.userData.profileImage }
                }
                style={{
                  borderRadius: IMAGE_WIDTH / 2,
                  borderColor: color.palette.golden,
                  borderWidth: 3,
                  height: IMAGE_WIDTH,
                  width: IMAGE_WIDTH,
                  backgroundColor: color.palette.white,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
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
                {authStore.userData == "" ? "Test UserName" : authStore.userData.profileName}
              </Animated.Text>
              <Animated.Text style={[TEXT_IDENTITY, { minWidth }]} numberOfLines={1}>
                {authStore.userData == "" ? "test@gmail.com" : authStore.userData.profileEmail}
              </Animated.Text>
              <Animated.Text style={[TEXT_IDENTITY, { minWidth }]} numberOfLines={1}>
                {"23th, oct, 1998"}
              </Animated.Text>
            </Animated.View>
          </Animated.View>
          <View style={{ flexGrow: 1, marginTop: VIEW_MIN_HEIGHT }}>
            <Animated.ScrollView
              style={{ flex: 1 }}
              bounces={false}
              overScrollMode="never"
              scrollEventThrottle={16}
              onScroll={(e) => {
                scrollY.setValue(e.nativeEvent.contentOffset.y)
              }}
            >
              <View style={MAIN_FLEX}>
                <Text text={"Saved Category"} style={SAVED_CATEGORY} />
                <View style={DIRECTION_ROW}>
                  <TextInput
                    value={searchText}
                    style={SEARCH_INPUT}
                    placeholderTextColor={color.palette.brownGray}
                    placeholder={"Search categories"}
                    onChangeText={(searchItem) => searchAction(searchItem)}
                    autoCorrect={false}
                  />
                  <Icon icon={"search"} style={SEARCH} />
                </View>
                <Accordion
                  sections={filterData}
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
    </View>
  )
})
