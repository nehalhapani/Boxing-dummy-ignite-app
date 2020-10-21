/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"

// import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { ProfileScreen } from "../screens"
import { Icon, Text } from "../components"
import { color, spacing } from "../theme"
import { ImageBackground, View, TouchableOpacity, SafeAreaView, Platform } from "react-native"
import { icons } from "../components/icon/icons"
import { PrimaryNavigator } from "./primary-navigator"

export type BottomTabParamList = {
  primary: undefined
  profile: undefined
}

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View
      style={{
        flexDirection: "row",
        height: "10.3%",
      }}
    >
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
            type: "tabPress",
            target: route.key,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
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
            style={{ flex: 1, backgroundColor: color.transparent, justifyContent: "flex-end" }}
          >
            <ImageBackground
              source={backgroundImage}
              resizeMode="stretch"
              style={{
                width: "100%",
                height: isFocused ? "122%" : "100%",
              }}
            >
              <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, justifyContent: "flex-end" }}>
                  <View
                    style={{
                      alignItems: "center",
                      marginBottom: Platform.OS == "ios" ? 0 : 10,
                    }}
                  >
                    <Icon icon={icon} style={{ marginVertical: spacing[2] }} />
                    <Text text={label} style={{ color: color.palette.black, fontSize: 18 }} />
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
