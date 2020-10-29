/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your PrimaryNavigator) which the user
 * will use once logged in.
 */
import React, { useEffect } from "react"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { AuthNavigator } from "./auth-navigator"
import { useStores } from "../models"
import { observer } from "mobx-react-lite"
import { DrawerNavigator } from "./drawer-navigator"
import SplashScreen from "react-native-splash-screen"
import { useNetInfo } from "@react-native-community/netinfo"
import { Alert } from "react-native"
import { string } from "../theme"

export type RootParamList = {
  drawer: undefined
  authStack: undefined
}

const Stack = createNativeStackNavigator<RootParamList>()

const RootStack = observer(() => {
  const { authStore } = useStores()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,

        /** stackPresentation: "modal", */
      }}
    >
      {authStore.isTokenSet ? (
        <Stack.Screen
          name="drawer"
          component={DrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <Stack.Screen
          name="authStack"
          component={AuthNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  )
})

export const RootNavigator = React.forwardRef<
  NavigationContainerRef,
  Partial<React.ComponentProps<typeof NavigationContainer>>
>((props, ref) => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  const netInfo = useNetInfo()

  /** give alert for no internet in screen when switch off internet */
  React.useEffect(() => {
    if (!netInfo.isConnected && netInfo.details != null) {
      Alert.alert(string.noInternet, string.internetMessage)
    }
  }, [netInfo.isConnected])
  return (
    <NavigationContainer {...props} ref={ref}>
      <RootStack />
    </NavigationContainer>
  )
})

RootNavigator.displayName = "RootNavigator"
