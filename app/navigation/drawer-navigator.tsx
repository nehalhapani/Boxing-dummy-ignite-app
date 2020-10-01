import React from "react"
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer"
import { HomeScreen } from "../screens"

export type DrawerParamList = {
  home: undefined
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Close drawer" onPress={() => props.navigation.closeDrawer()} />
      <DrawerItem label="Toggle drawer" onPress={() => props.navigation.toggleDrawer()} />
    </DrawerContentScrollView>
  )
}
const Drawer = createDrawerNavigator<DrawerParamList>()

export function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="home" component={HomeScreen} />
    </Drawer.Navigator>
  )
}
