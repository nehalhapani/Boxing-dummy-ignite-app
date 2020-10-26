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
  KeyboardAvoidingView,
  StatusBar,
  Platform,
} from "react-native"
import { GoogleSignin, statusCodes } from "@react-native-community/google-signin"
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk"
import Spinner from "react-native-spinkit"

import { color, fontSize, typography } from "../../theme"
import { icons } from "../../components/icon/icons"
import { Text, Button } from "../../components"
import { useStores } from "../../models"
import { validatePassword, validateEmail } from "../../utils/custom-validate"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

const ROOT: ViewStyle = {
  flex: 1,
  paddingTop: hp("4.3%"),
}
const BUTTONVIEW_SIGNIN: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: hp("2%"),
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
  paddingHorizontal: hp("3.7%"),
  paddingBottom: 5,
  flex: 1,
  justifyContent: "space-between",
  backgroundColor: color.transparent,
}
const EMAIL_INPUT: TextStyle = {
  height: Platform.OS == "ios" ? hp("6%") : hp("6.5%"),
  borderColor: "gray",
  fontSize: fontSize.FONT_18Px,
  color: color.palette.white,
  borderBottomWidth: hp("0.167%"),
  textAlign: "left",
  paddingLeft: 0,
  fontFamily: typography.fontLight,
}
const LOGO_SPACING: ViewStyle = {
  paddingVertical: hp("1%"),
  paddingTop: Platform.OS == "ios" ? hp("5%") : hp("1%"),
}
const WELCOME_MSG: TextStyle = {
  fontSize: fontSize.FONT_30Px,
  fontFamily: typography.fontBold,
}
const BOTTOM_VIEW: ViewStyle = {
  paddingBottom: hp("1.7%"),
  paddingHorizontal: hp("3.7%"),
  marginBottom: Platform.OS == "ios" ? hp("2.1%") : hp("0%"),
}
const TEXT_COLOR: TextStyle = {
  color: "#FEFEFE",
  fontSize: fontSize.FONT_16Px,
  fontFamily: typography.fontRegular,
}
const BUTTON: ViewStyle = {
  paddingTop: hp("3.2%"),
}
const SIGN_IN_TEXT: TextStyle = {
  color: "#000",
  fontSize: fontSize.FONT_16Px,
  letterSpacing: 3.07,
  fontFamily: typography.fontRegular,
}
const INPUT_VIEW: ViewStyle = {
  paddingTop: hp("2.5%"),
}
const INPUT_SUB_VIEW: ViewStyle = {
  paddingVertical: hp("0.5"),
}
const SUB_TEXT: TextStyle = {
  fontSize: fontSize.FONT_18Px,
  fontFamily: typography.fontRegular,
}
const NAME_TEXT: TextStyle = {
  fontSize: fontSize.FONT_12Px,
  fontFamily: typography.fontLight,
}
const ERROR_STYLE: TextStyle = {
  color: color.palette.angry,
  fontSize: fontSize.FONT_12Px,
  paddingTop: hp("0.7%"),
  fontFamily: typography.fontRegular,
}
const FB_BUTTON: ViewStyle = {
  paddingVertical: hp("0.7"),
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
export const SignInScreen = observer(function SignInScreen() {
  const { authStore } = useStores()
  const [username, setUsername] = useState("")
  const [userNameError, setUserNameError] = useState("")
  const [runtimeUserame, setRuntimeUsername] = useState(false)
  const [passwordError, setPasswordError] = useState([])
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")

  //get google sign in confirguration
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "400169882902-vcn7snnfnajehl7vj7i0hsh41e6k8aft.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    })
  }, [])

  // google sign in request
  const signIn = async () => {
    try {
      setLoading(true)
      await GoogleSignin.hasPlayServices()

      //get user details of logged user
      const userInfo = await GoogleSignin.signIn()
      let profileData = {
        profileImage: userInfo.user.photo,
        profileName: userInfo.user.name,
        profileEmail: userInfo.user.email,
      }
      authStore.setToken()
      authStore.setUserData(profileData)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setLoading(false)
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        setLoading(false)
      }
    }
    setLoading(false)
  }

  // input field reference
  const ref_input2 = useRef(null)

  // user data array for filter incoming username and password for login to app
  const USER_DATA = [{ username: "test@gmail.com", password: "test@12345" }]

  // login form validation -validate field
  const ValidateForm = () => {
    setRuntimeUsername(true)
    let isUsernameError = UsernameValidate(username)
    let isPasswordError = PasswordValidate(password)

    if (isUsernameError && isPasswordError) {
      var results = USER_DATA.filter((item) => {
        return username == item.username && password == item.password
      })
      if (results.length == 0) {
        setRuntimeUsername(true)
        Alert.alert("Invalid Inputs!!", "Please enter valid username and password")
      } else {
        authStore.setToken()
      }
    } else {
    }
  }

  //userName validations for get validate error
  const UsernameValidate = (username) => {
    let nameData = validateEmail(username)
    setUserNameError(nameData)
    if (nameData == "") {
      return true
    } else {
      return false
    }
  }

  //password validations for get validate errors
  const PasswordValidate = (password) => {
    let passwordData = validatePassword(password)
    setPasswordError(passwordData)

    if (passwordData.length == 0) {
      return true
    } else {
      return false
    }
  }

  // handle email validate
  const handleEmailError = (username) => {
    setUsername(username)
    if (runtimeUserame) {
      UsernameValidate(username)
    }
  }

  // handle password validate
  const handlePasswordError = (password) => {
    setPassword(password)
    if (runtimeUserame) {
      PasswordValidate(password)
    }
  }

  // facebook login request / graph request for email and public profile
  const loginWIthFacebook = () => {
    setLoading(true)
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only")
    }
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
          setLoading(false)
          Alert.alert("Login Cancelled", "Something Went Wrong!!")
        } else {
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
              setLoading(false),
            )
            // Start the graph request.
            new GraphRequestManager().addRequest(infoRequest).start()
          })
        }
      },
      function (error) {},
    )
  }

  // get details of logged user using facebook
  const _responseInfoCallback = (error, result) => {
    if (error) {
    } else {
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
      <StatusBar barStyle={"light-content"} backgroundColor={"black"} />
      <KeyboardAvoidingView style={ROOT}>
        <View style={MAINFLEX}>
          <View>
            <View>
              <View style={LOGO_SPACING}>
                <Image source={icons["logo"]} style={{ height: hp("8%"), width: hp("8%") }} />
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
                  autoCompleteType={"email"}
                  autoCorrect={false}
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
                  autoCompleteType={"password"}
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
        </View>
      </KeyboardAvoidingView>
      {loading && (
        <View style={INDICATOR}>
          <Spinner type={"Bounce"} color={color.palette.white} />
        </View>
      )}
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
    </ImageBackground>
  )
})
