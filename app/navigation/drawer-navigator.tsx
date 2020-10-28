import React from "react"
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer"
import { View, ViewStyle, TextStyle, Image, ImageStyle, FlatList, Alert } from "react-native"
import { Text } from "../components"
import { icons } from "../components/icon/icons"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { BottomTabNavigator } from "./bottom-tab-navigator"
import { color, fontSize, typography, string } from "../theme"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

export type DrawerParamList = {
  bottomTab: undefined
}

const MAIN: ViewStyle = {
  backgroundColor: "black",
  padding: hp("3.7%"),
}
const LOGO_SPACING: ViewStyle = {
  paddingVertical: 1,
}
const BOXING: TextStyle = {
  fontSize: hp("2.67%"),
  fontWeight: "bold",
}
const SUB_TEXT: TextStyle = {
  fontSize: 5,
  letterSpacing: 2.4,
}
const LOGO_SIZE: ImageStyle = {
  height: hp("4%"),
  width: hp("4%"),
}
const LINK_VIEW: ViewStyle = {
  marginTop: hp("5.56%"),
  justifyContent: "space-between",
}
const labelStyle = {
  lineHeight: hp("5.56%"),
  fontSize: fontSize.FONT_22Px,
  marginVertical: -10,
  fontFamily: typography.fontBold,
}
const DRAWER_STYLE: ViewStyle = {
  marginLeft: 0,
  marginVertical: 0,
}
const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: "space-between",
}
const BACKGROUND_STYLE: ViewStyle = {
  backgroundColor: "black",
}
const LEFT_MARGIN: ViewStyle = {
  marginLeft: 10,
}

function CustomDrawerContent(props) {
  const { categoryStore, mediaStore, authStore } = useStores()
  const navigation = useNavigation()

  /**
   * logout confirmation on click logout button
   */
  const removeTokenConfirmation = () => {
    Alert.alert(string.logOut, string.logOutMessage, [
      {
        text: string.cancel,
        onPress: () => null,
        style: "cancel",
      },
      {
        text: string.logOut,
        onPress: () => {
          mediaStore.recentDataCleanup()
          authStore.removeToken()
        },
        style: "destructive",
      },
    ])
  }

  return (
    <DrawerContentScrollView style={MAIN} contentContainerStyle={CONTAINER}>
      <View style={BACKGROUND_STYLE}>
        <View style={LEFT_MARGIN}>
          <View style={LOGO_SPACING}>
            <Image source={icons.logo} style={LOGO_SIZE} />
          </View>
          <Text style={BOXING} text={string.boxing} />
          <Text style={SUB_TEXT} text={string.organization} />
        </View>

        <View style={LINK_VIEW}>
          {/* drawer item - deshboard */}
          <View>
            <DrawerItem
              label={string.dashboard}
              onPress={() => navigation.navigate("dashboard")}
              style={DRAWER_STYLE}
              labelStyle={labelStyle}
              activeTintColor={color.palette.golden}
              inactiveTintColor={color.palette.white}
              activeBackgroundColor={color.transparent}
              focused={mediaStore.indexForSubcategory == 0 ? true : false}
            />

            {/* get dynamic drawer items - categories from api */}
            <FlatList
              data={categoryStore.category}
              renderItem={({ item, index }: any) => {
                return (
                  <DrawerItem
                    label={item.name}
                    onPress={() =>
                      navigation.navigate("subCategory", {
                        id: item.id,
                        name: item.name,
                      })
                    }
                    style={DRAWER_STYLE}
                    labelStyle={labelStyle}
                    activeTintColor={color.palette.golden}
                    inactiveTintColor={color.palette.white}
                    activeBackgroundColor={color.transparent}
                    focused={mediaStore.indexForSubcategory == item.id ? true : false}
                  />
                )
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </View>

      {/* drawer item - logout */}
      <View style={BACKGROUND_STYLE}>
        <DrawerItem
          label={string.logOut}
          onPress={() => removeTokenConfirmation()}
          style={DRAWER_STYLE}
          labelStyle={labelStyle}
          activeTintColor={color.palette.golden}
          inactiveTintColor={color.palette.white}
        />
      </View>
    </DrawerContentScrollView>
  )
}
const Drawer = createDrawerNavigator<DrawerParamList>()

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: "#EECE00",
        inactiveTintColor: "red",
      }}
      drawerStyle={{
        borderBottomColor: color.palette.black,
        borderWidth: 0,
        backgroundColor: color.palette.black,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerPosition={"right"}
      drawerType={"slide"}
      edgeWidth={12}
    >
      <Drawer.Screen name="bottomTab" component={BottomTabNavigator} />
    </Drawer.Navigator>
  )
}
