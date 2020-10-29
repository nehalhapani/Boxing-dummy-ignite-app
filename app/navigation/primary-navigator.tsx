import React from "react"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { HomeScreen, SubCategoryScreen, MediaImageScreen, VideoScreen } from "../screens"

export type PrimaryParamList = {
  dashboard: undefined
  subCategory: undefined
  image: undefined
  video: undefined
}

/** Documentation: https://github.com/software-mansion/react-native-screens/tree/master/native-stack */
const Stack = createNativeStackNavigator<PrimaryParamList>()

export function PrimaryNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="dashboard" component={HomeScreen} />
      <Stack.Screen name="subCategory" component={SubCategoryScreen} />
      <Stack.Screen name="image" component={MediaImageScreen} />
      <Stack.Screen name="video" component={VideoScreen} />
    </Stack.Navigator>
  )
}

const exitRoutes = ["home"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
