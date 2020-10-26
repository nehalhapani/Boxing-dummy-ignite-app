import React, { useState } from "react"
import { TextStyle, View, ViewStyle, ImageStyle, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models"
import { color, fontSize } from "../../theme"
import { Icon, Text } from "../../components"
import { useNavigation, StackActions } from "@react-navigation/native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

const NAVIGATE_VIEW: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}

const PREV_BTN: ImageStyle = { width: 5, height: 9, tintColor: color.palette.white }
const NEXT_BTN: ImageStyle = {
  ...PREV_BTN,
  transform: [{ rotate: "180deg" }],
  tintColor: color.palette.black,
}
const PREV_VIEW: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: hp("0.1%"),
  borderColor: color.palette.white,
  paddingHorizontal: hp("1%"),
  paddingVertical: hp("0.97%"),
  backgroundColor: color.transparent,
  opacity: 1,
}
const DISABLE_PREV_VIEW: ViewStyle = {
  ...PREV_VIEW,
  opacity: 0.3,
}

const TEXT_PREV: TextStyle = {
  fontSize: fontSize.FONT_12Px,
  paddingLeft: hp("1.18%"),
  color: color.palette.white,
}
const TEXT_NEXT: TextStyle = {
  fontSize: fontSize.FONT_12Px,
  paddingRight: hp("1.18%"),
  color: color.palette.black,
}
const NEXT_VIEW: ViewStyle = {
  ...PREV_VIEW,
  backgroundColor: color.palette.golden,
  borderColor: color.transparent,
  opacity: 1,
}
const DISABLE_NEXT_VIEW: ViewStyle = {
  ...NEXT_VIEW,
  opacity: 0.3,
}
export interface NavigateProps {
  id?: number
  parent_id?: number
}

export const Navigate = observer(function Navigate(props: NavigateProps) {
  const { mediaStore } = useStores()
  const navigation = useNavigation()
  const [btnDisable, setBtnDisable] = useState(false)
  const [nextBtnDisable, setNextBtnDisable] = useState(false)

  const { id, parent_id } = props

  function findArrayObject(array, parentId) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i].parent_id == parentId) {
        return i
      }
    }
    return -1
  }

  // function for next button
  const nextClicked = async () => {
    let index = findArrayObject(mediaStore.allSubCategoryMedia, parent_id)
    let lastSubcategoryIndex = mediaStore.allSubCategoryMedia.findIndex((x) => x.parent_id == 3)
    for (var i = 0; i < mediaStore.allSubCategoryMedia[index].data.length; i += 1) {
      if (mediaStore.allSubCategoryMedia[index].data[i].id == id) {
        // if no further screens -set button disable
        if (
          index == lastSubcategoryIndex &&
          i == mediaStore.allSubCategoryMedia[index].data.length - 1
        ) {
          setNextBtnDisable(true)
        } else if (i == mediaStore.allSubCategoryMedia[index].data.length - 1) {
          // navigate between categories
          setNextBtnDisable(false)
          await mediaStore.getSubCategoryItems(parent_id + 1)
          mediaStore.subcategoryCleanup()
          let newIndex = findArrayObject(mediaStore.allSubCategoryMedia, parent_id + 1)
          navigation.dispatch(
            StackActions.replace(
              mediaStore.allSubCategoryMedia[newIndex].data[0].type == "Image" ? "immage" : "video",
              {
                id: mediaStore.allSubCategoryMedia[newIndex].data[0].id,
                parent_id: mediaStore.allSubCategoryMedia[newIndex].data[0].parent_id,
                name: mediaStore.allSubCategoryMedia[newIndex].data[0].name,
                screenType: mediaStore.allSubCategoryMedia[newIndex].data[0].type,
              },
            ),
          )
        } else {
          // navigate between subCategories within same category
          setNextBtnDisable(false)
          let subCategoryId = mediaStore.allSubCategoryMedia[index].data.findIndex(
            (x) => x.id == id,
          )
          mediaStore.subcategoryCleanup()
          navigation.dispatch(
            StackActions.replace(
              mediaStore.allSubCategoryMedia[index].data[subCategoryId + 1].type == "Image"
                ? "image"
                : "video",
              {
                id: mediaStore.allSubCategoryMedia[index].data[subCategoryId + 1].id,
                parent_id: mediaStore.allSubCategoryMedia[index].data[subCategoryId + 1].parent_id,
                name: mediaStore.allSubCategoryMedia[index].data[subCategoryId + 1].name,
                screenType: mediaStore.allSubCategoryMedia[index].data[subCategoryId + 1].type,
              },
            ),
          )
        }
      }
    }
  }

  // previous button funtions
  const prevClicked = async () => {
    let index = findArrayObject(mediaStore.allSubCategoryMedia, parent_id)
    let subCategoryIndex = mediaStore.allSubCategoryMedia.findIndex((x) => x.parent_id == 1)
    for (var i = 0; i < mediaStore.allSubCategoryMedia[index].data.length; i += 1) {
      if (mediaStore.allSubCategoryMedia[index].data[i].id == id) {
        // disable prev button when no further navigations possible
        if (index == subCategoryIndex && i == 0) {
          setBtnDisable(true)
        } else if (i == 0) {
          // navigate between categories
          setBtnDisable(false)
          mediaStore.subcategoryCleanup()
          await mediaStore.getSubCategoryItems(parent_id - 1)
          let newIndex = findArrayObject(mediaStore.allSubCategoryMedia, parent_id - 1)
          navigation.dispatch(
            StackActions.replace(
              mediaStore.allSubCategoryMedia[newIndex].data[
                mediaStore.allSubCategoryMedia[newIndex].data.length - 1
              ].type == "Image"
                ? "image"
                : "video",
              {
                id:
                  mediaStore.allSubCategoryMedia[newIndex].data[
                    mediaStore.allSubCategoryMedia[newIndex].data.length - 1
                  ].id,
                parent_id:
                  mediaStore.allSubCategoryMedia[newIndex].data[
                    mediaStore.allSubCategoryMedia[newIndex].data.length - 1
                  ].parent_id,
                name:
                  mediaStore.allSubCategoryMedia[newIndex].data[
                    mediaStore.allSubCategoryMedia[newIndex].data.length - 1
                  ].name,
                screenType:
                  mediaStore.allSubCategoryMedia[newIndex].data[
                    mediaStore.allSubCategoryMedia[newIndex].data.length - 1
                  ].type,
              },
            ),
          )
        } else {
          // navigate within same category media
          setBtnDisable(false)
          mediaStore.subcategoryCleanup()
          let subCategoryId = mediaStore.allSubCategoryMedia[index].data.findIndex(
            (x) => x.id == id,
          )
          navigation.dispatch(
            StackActions.replace(
              mediaStore.allSubCategoryMedia[index].data[subCategoryId - 1].type == "Image"
                ? "image"
                : "video",
              {
                id: mediaStore.allSubCategoryMedia[index].data[subCategoryId - 1].id,
                parent_id: mediaStore.allSubCategoryMedia[index].data[subCategoryId - 1].parent_id,
                name: mediaStore.allSubCategoryMedia[index].data[subCategoryId - 1].name,
                screenType: mediaStore.allSubCategoryMedia[index].data[subCategoryId - 1].type,
              },
            ),
          )
        }
      }
    }
  }

  return (
    <View style={NAVIGATE_VIEW}>
      <TouchableOpacity
        style={btnDisable ? DISABLE_PREV_VIEW : PREV_VIEW}
        disabled={btnDisable}
        onPress={() => prevClicked()}
      >
        <Icon icon={"back"} style={PREV_BTN} />
        <Text text={"PREV"} style={TEXT_PREV} />
      </TouchableOpacity>
      <TouchableOpacity
        style={nextBtnDisable ? DISABLE_NEXT_VIEW : NEXT_VIEW}
        disabled={nextBtnDisable}
        onPress={() => nextClicked()}
      >
        <Text text={"NEXT"} style={TEXT_NEXT} />
        <Icon icon={"back"} style={NEXT_BTN} />
      </TouchableOpacity>
    </View>
  )
})
