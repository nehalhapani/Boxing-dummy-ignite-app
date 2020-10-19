import * as React from "react"
import { TextStyle, View, ViewStyle, ImageStyle, TouchableOpacity, Alert } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models"
import { color } from "../../theme"
import { Icon, Text } from "../../components"
import { useNavigation, StackActions } from "@react-navigation/native"

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
  borderWidth: 1,
  borderColor: color.palette.white,
  paddingHorizontal: 10,
  paddingVertical: 8.7,
  backgroundColor: color.transparent,
}
const TEXT_PREV: TextStyle = {
  fontSize: 12,
  paddingLeft: 10.7,
  color: color.palette.white,
}
const TEXT_NEXT: TextStyle = {
  fontSize: 12,
  paddingRight: 10.7,
  color: color.palette.black,
}
const NEXT_VIEW: ViewStyle = {
  ...PREV_VIEW,
  backgroundColor: color.palette.golden,
  borderColor: color.transparent,
}
export interface NavigateProps {
  id?: number
  parent_id?: number
}

export const Navigate = observer(function Navigate(props: NavigateProps) {
  const { mediaStore } = useStores()
  const navigation = useNavigation()
  const { id, parent_id } = props

  function findArrayObject(array, parentId) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i].parent_id == parentId) {
        return i
      }
    }
    return -1
  }
  console.tron.log("ZZZZZ", mediaStore.allSubCategoryMedia)
  const nextClicked = async () => {
    let index = findArrayObject(mediaStore.allSubCategoryMedia, parent_id)
    let lastSubcategoryIndex = mediaStore.allSubCategoryMedia.findIndex((x) => x.parent_id == 3)
    for (var i = 0; i < mediaStore.allSubCategoryMedia[index].data.length; i += 1) {
      if (mediaStore.allSubCategoryMedia[index].data[i].id == id) {
        if (
          index == lastSubcategoryIndex &&
          i == mediaStore.allSubCategoryMedia[index].data.length - 1
        ) {
          Alert.alert("Nothing Here")
        } else if (i == mediaStore.allSubCategoryMedia[index].data.length - 1) {
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
              },
            ),
          )
        } else {
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
              },
            ),
          )
        }
      }
    }
  }

  const prevClicked = async () => {
    let index = findArrayObject(mediaStore.allSubCategoryMedia, parent_id)
    let subCategoryIndex = mediaStore.allSubCategoryMedia.findIndex((x) => x.parent_id == 1)
    console.tron.log("BBB", mediaStore.allSubCategoryMedia)
    for (var i = 0; i < mediaStore.allSubCategoryMedia[index].data.length; i += 1) {
      if (mediaStore.allSubCategoryMedia[index].data[i].id == id) {
        if (index == subCategoryIndex && i == 0) {
          mediaStore.subcategoryCleanup()
          Alert.alert("Nothing Here")
        } else if (i == 0) {
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
              },
            ),
          )
        } else {
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
              },
            ),
          )
        }
      }
    }
  }

  return (
    <View style={NAVIGATE_VIEW}>
      <TouchableOpacity style={PREV_VIEW} onPress={() => prevClicked()}>
        <Icon icon={"back"} style={PREV_BTN} />
        <Text text={"PREV"} style={TEXT_PREV} />
      </TouchableOpacity>
      <TouchableOpacity style={NEXT_VIEW} onPress={() => nextClicked()}>
        <Text text={"NEXT"} style={TEXT_NEXT} />
        <Icon icon={"back"} style={NEXT_BTN} />
      </TouchableOpacity>
    </View>
  )
})