import React from "react"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { SignInScreen } from "../screens"

export type AuthParamList = {
  signIn: undefined
}

const Stack = createNativeStackNavigator<AuthParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="signIn" component={SignInScreen} />
    </Stack.Navigator>
  )
}

// const exitRoutes = ["home"]
// export const canExit = (routeName: string) => exitRoutes.includes(routeName)
