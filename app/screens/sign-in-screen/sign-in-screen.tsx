import React, { useState, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  View,
  ImageBackground,
  Image,
  TextInput,
  TextStyle,
  Alert,
  ImageStyle,
  Keyboard,
} from "react-native"
import { Screen, Text, Button } from "../../components"
import { color, spacing } from "../../theme"
import { validatePassword, validateEmail } from "../../utils/custom-validate"
import { GoogleSignin, statusCodes } from "@react-native-community/google-signin"
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk"
import { useStores } from "../../models"
import { icons } from "../../components/icon/icons"

const ROOT: ViewStyle = {
  flex: 1,
}
const BUTTONVIEW_SIGNIN: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 20.7,
  backgroundColor: color.palette.golden,
}
const BUTTONVIEW_FACEBOOK: ViewStyle = {
  ...BUTTONVIEW_SIGNIN,
  backgroundColor: color.palette.facebook_blue,
}
const BUTTONVIEW_GOOGLE: ViewStyle = {
  ...BUTTONVIEW_SIGNIN,
  backgroundColor: color.palette.google_red,
}
const BACKGROUND: ImageStyle = {
  flex: 1,
  backgroundColor: color.palette.black,
  resizeMode: "cover",
}
const MAINFLEX: ViewStyle = {
  paddingHorizontal: 33.3,
  paddingBottom: 30,
  flex: 1,
  justifyContent: "space-between",
}
const EMAIL_INPUT: TextStyle = {
  height: 50,
  borderColor: "gray",
  fontSize: 16,
  color: color.palette.white,
  borderBottomWidth: 1.5,
  borderStartColor: color.palette.white,
}
const LOGO_SPACING: ViewStyle = {
  paddingVertical: 19,
  paddingTop: 30,
}
const WELCOME_MSG: TextStyle = {
  fontSize: 30,
  fontWeight: "bold",
}
const BOTTOM_VIEW: ViewStyle = {
  paddingBottom: spacing[4],
}
const TEXT_COLOR: TextStyle = {
  color: "#FEFEFE",
  fontSize: 15,
}
const BUTTON: ViewStyle = {
  paddingTop: 33,
  paddingBottom: 6,
}
const SIGN_IN_TEXT: TextStyle = {
  color: "#000",
  fontSize: 15,
  letterSpacing: 3.07,
}
const INPUT_VIEW: ViewStyle = {
  paddingTop: 30,
}
const INPUT_SUB_VIEW: ViewStyle = {
  paddingVertical: 7.5,
}
const SUB_TEXT: TextStyle = {
  fontSize: 17,
}
const NAME_TEXT: TextStyle = {
  fontSize: 12,
}
const ERROR_STYLE: TextStyle = {
  color: color.palette.angry,
  fontSize: 12,
  paddingTop: 9,
}
const FB_BUTTON: ViewStyle = {
  paddingVertical: 6,
}
export const SignInScreen = observer(function SignInScreen() {
  const { authStore } = useStores()
  const [username, setUsername] = useState("")
  const [userNameError, setUserNameError] = useState("")
  const [runtimeUserame, setRuntimeUsername] = useState(false)
  const [passwordError, setPasswordError] = useState([])
  const [password, setPassword] = useState("")
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "400169882902-vcn7snnfnajehl7vj7i0hsh41e6k8aft.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    })
  }, [])

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      console.tron.log("UserData", userInfo)
      let profileData = {
        profileImage: userInfo.user.photo,
        profileName: userInfo.user.name,
        profileEmail: userInfo.user.email,
      }
      authStore.setToken()
      authStore.setUserData(profileData)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        console.log(error)
      }
    }
  }

  const ref_input2 = useRef(null)

  const USER_DATA = [{ username: "test@gmail.com", password: "test@12345" }]
  const ValidateForm = () => {
    setRuntimeUsername(true)
    let isUsernameError = UsernameValidate(username)
    let isPasswordError = PasswordValidate(password)

    if (isUsernameError && isPasswordError) {
      var results = USER_DATA.filter((item) => {
        return username == item.username && password == item.password
      })
      if (results.length == 0) {
        console.log("Unsuceesfull!")
        setRuntimeUsername(true)
        Alert.alert("Invalid Inputs!!", "Please enter valid username and password")
      } else {
        authStore.setToken()
      }
      console.log("Sucess")
    } else {
    }
  }
  const UsernameValidate = (username) => {
    let nameData = validateEmail(username)
    setUserNameError(nameData)
    if (nameData == "") {
      return true
    } else {
      return false
    }
  }
  const PasswordValidate = (password) => {
    let passwordData = validatePassword(password)
    setPasswordError(passwordData)

    if (passwordData.length == 0) {
      return true
    } else {
      return false
    }
  }

  const handleEmailError = (username) => {
    setUsername(username)
    if (runtimeUserame) {
      UsernameValidate(username)
    }
  }
  const handlePasswordError = (password) => {
    setPassword(password)
    if (runtimeUserame) {
      PasswordValidate(password)
    }
  }
  const loginWIthFacebook = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
          console.log("Login cancelled")
        } else {
          console.log("Login success with permissions: " + result.grantedPermissions.toString())
          AccessToken.getCurrentAccessToken().then((data) => {
            const infoRequest = new GraphRequest(
              "/me",
              {
                accessToken: data.accessToken.toString(),
                parameters: {
                  fields: {
                    string: "email,name,last_name,picture",
                  },
                },
              },
              _responseInfoCallback,
            )

            // Start the graph request.
            new GraphRequestManager().addRequest(infoRequest).start()
          })
        }
      },
      function (error) {
        console.log("Login fail with error: " + error)
      },
    )
  }
  const _responseInfoCallback = (error, result) => {
    if (error) {
      console.log("Error fetching data: " + error.toString())
    } else {
      console.tron.log(result)
      let profileData = {
        profileImage: result.picture.data.url,
        profileName: result.name,
        profileEmail: result.email,
      }

      authStore.setUserData(profileData)
      authStore.setToken()
    }
  }
  return (
    <ImageBackground source={icons["backgroundImage"]} style={BACKGROUND}>
      <Screen style={ROOT} backgroundColor={color.transparent} preset="fixed">
        <View style={MAINFLEX}>
          <View>
            <View>
              <View style={LOGO_SPACING}>
                <Image source={icons["logo"]} />
              </View>
              <Text style={WELCOME_MSG} text="Welcome Back," />
              <Text style={SUB_TEXT} text="Sign in to continue" />
            </View>

            <View style={INPUT_VIEW}>
              <View style={INPUT_SUB_VIEW}>
                <Text style={NAME_TEXT} text="Email Address" />
                <TextInput
                  style={EMAIL_INPUT}
                  value={username}
                  autoCapitalize="none"
                  returnKeyType={"next"}
                  placeholder={"Enter Email Here"}
                  placeholderTextColor={color.palette.offWhite}
                  onSubmitEditing={() => ref_input2.current.focus()}
                  blurOnSubmit={false}
                  onChangeText={(username) => handleEmailError(username)}
                />
                <View>
                  <Text style={ERROR_STYLE} text={userNameError} />
                </View>
              </View>
              <View style={INPUT_SUB_VIEW}>
                <Text style={NAME_TEXT} text="Password" />
                <TextInput
                  secureTextEntry={true}
                  style={EMAIL_INPUT}
                  value={password}
                  placeholder={"Enter Password Here"}
                  placeholderTextColor={color.palette.offWhite}
                  returnKeyType="done"
                  ref={ref_input2}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  onChangeText={(password) => handlePasswordError(password)}
                />

                {passwordError.map((item, key) => (
                  <Text text={item} key={key} style={ERROR_STYLE} />
                ))}
              </View>
              <View style={BUTTON}>
                <Button
                  style={BUTTONVIEW_SIGNIN}
                  textStyle={SIGN_IN_TEXT}
                  text="SIGN IN"
                  onPress={() => ValidateForm()}
                />
              </View>
            </View>
          </View>

          <View style={BOTTOM_VIEW}>
            <View style={FB_BUTTON}>
              <Button
                style={BUTTONVIEW_FACEBOOK}
                textStyle={TEXT_COLOR}
                text="Login with Facebook"
                onPress={() => loginWIthFacebook()}
              />
            </View>
            <View style={FB_BUTTON}>
              <Button
                style={BUTTONVIEW_GOOGLE}
                textStyle={TEXT_COLOR}
                text="Login with Gmail"
                onPress={() => signIn()}
              />
            </View>
          </View>
        </View>
      </Screen>
    </ImageBackground>
  )
})
