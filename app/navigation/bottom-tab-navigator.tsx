import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { ProfileScreen } from "../screens"
import { Icon, Text } from "../components"
import { color, typography, string } from "../theme"
import {
  ImageBackground,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native"
import { icons } from "../components/icon/icons"
import { PrimaryNavigator } from "./primary-navigator"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

export type BottomTabParamList = {
  primary: undefined
  profile: undefined
}
const MAIN_VIEW: ViewStyle = {
  flex: 1,
  backgroundColor: color.transparent,
  justifyContent: "flex-end",
}
const CONTAINER: ViewStyle = {
  flexDirection: "row",
  height: hp("10%"),
}
const VIEW_BOTTOM: ViewStyle = {
  flex: 1,
}
const SAFEAREA_STYLE: ViewStyle = {
  flex: 1,
  justifyContent: "flex-end",
}
const CONTENT_STYLE: ViewStyle = {
  alignItems: "center",
  marginBottom: Platform.OS == "ios" ? 0 : hp("1.5%"),
}
const ICON_STYLE: ImageStyle = {
  marginVertical: hp("0.44%"),
  height: hp("2.9%"),
}
const LABEL_STYLE: TextStyle = {
  color: color.palette.black,
  fontSize: hp("2%"),
  fontFamily: typography.fontRegular,
}

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={CONTAINER}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index
        const icon = route.name == "primary" ? "home" : "profile"
        const backgroundImage = isFocused ? icons.tabactive : icons.tabinactive

        const onPress = () => {
          const event = navigation.emit({
            type: string.tabPress,
            target: route.key,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: string.tabLongPress,
            target: route.key,
          })
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            activeOpacity={1}
            onPress={onPress}
            onLongPress={onLongPress}
            style={MAIN_VIEW}
          >
            <ImageBackground
              source={backgroundImage}
              resizeMode="stretch"
              style={{
                width: "100%",
                height: isFocused ? "122%" : "100%",
              }}
            >
              <View style={VIEW_BOTTOM}>
                <SafeAreaView style={SAFEAREA_STYLE}>
                  <View style={CONTENT_STYLE}>
                    <Icon icon={icon} style={ICON_STYLE} />
                    <Text text={label} style={LABEL_STYLE} />
                  </View>
                </SafeAreaView>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
const Tab = createBottomTabNavigator<BottomTabParamList>()

export function BottomTabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen options={{ title: "Dashboard" }} name="primary" component={PrimaryNavigator} />
      <Tab.Screen options={{ title: "My Profile" }} name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
