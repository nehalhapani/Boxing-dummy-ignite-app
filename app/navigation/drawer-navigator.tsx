//TODO : set logout
import React, { useEffect } from "react"
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer"
import { View, ViewStyle, TextStyle, Image, ImageStyle, FlatList } from "react-native"
import { Text } from "../components"
import { icons } from "../components/icon/icons"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { BottomTabNavigator } from "./bottom-tab-navigator"
import { color } from "../theme"

export type DrawerParamList = {
  bottomTab: undefined
}
const MAINFLEX: ViewStyle = {
  justifyContent: "space-between",
  backgroundColor: "white",
  flex: 1,
}
const LOGO_SPACING: ViewStyle = {
  paddingVertical: 1,
}
const BOXING: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
}
const SUB_TEXT: TextStyle = {
  fontSize: 5,
  letterSpacing: 2.4,
}
const LOGO_SIZE: ImageStyle = {
  height: 36,
  width: 36,
}
const LINK_VIEW: ViewStyle = {
  marginTop: 50,
  justifyContent: "space-between",
}
const labelStyle = {
  lineHeight: 50,
  marginLeft: -10,
  fontSize: 20,
  marginVertical: -10,
}
const DRAWER_STYLE: ViewStyle = {
  marginLeft: 0,
  marginVertical: 0,
}

function CustomDrawerContent(props) {
  const { authStore } = useStores()
  const { categoryStore, mediaStore } = useStores()
  const navigation = useNavigation()

  return (
    <DrawerContentScrollView style={{ backgroundColor: "black", padding: 33.3 }}>
      <View style={MAINFLEX}>
        <View style={{ backgroundColor: "black" }}>
          <View>
            <View style={LOGO_SPACING}>
              <Image source={icons.logo} style={LOGO_SIZE} />
            </View>
            <Text style={BOXING} text="BOXING" />
            <Text style={SUB_TEXT} text="BY TATVASOFT" />
          </View>
          <View style={LINK_VIEW}>
            <View>
              <DrawerItem
                label="DASHBOARD"
                onPress={() => navigation.navigate("dashboard")}
                style={DRAWER_STYLE}
                labelStyle={labelStyle}
                activeTintColor={color.palette.golden}
                inactiveTintColor={color.palette.white}
                activeBackgroundColor={color.transparent}
                focused={mediaStore.indexForSubcategory == 0 ? true : false}
              />

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
        <View style={{ backgroundColor: "black" }}>
          <DrawerItem
            label="LOG OUT"
            onPress={() => authStore.removeToken()}
            style={DRAWER_STYLE}
            labelStyle={labelStyle}
            activeTintColor={color.palette.golden}
            inactiveTintColor={color.palette.white}
          />
        </View>
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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerPosition={"right"}
      drawerType={"slide"}
      edgeWidth={12}
    >
      <Drawer.Screen name="bottomTab" component={BottomTabNavigator} />
    </Drawer.Navigator>
  )
}
