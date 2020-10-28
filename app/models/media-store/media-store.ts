import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { Api } from "../../services/api"
import { string } from "../../theme"

const api = new Api()
api.setup()

export const MediaStoreModel = types
  .model("MediaStore")
  .props({
    /** all subcategory data array */
    allSubCategoryMedia: types.optional(types.array(types.frozen()), []),

    /** current subcategory data array */
    subCategory: types.optional(types.frozen(), []),

    /** perticular subcategory media array */
    mediaArray: types.optional(types.frozen(), []),

    /** index array for drawer active link */
    indexForSubcategory: types.optional(types.integer, 0),

    /** recently visited media array */
    recentData: types.optional(types.frozen(), []),

    /**media id array */
    seenMedia: types.optional(types.array(types.frozen()), []),
    loading: false,
  })

  .views((self) => ({}))
  .actions((self) => ({
    /**  api call for sub category data */
    getSubCategoryItems: flow(function* getSubCategoryItems(id: number) {
      try {
        self.loading = true
        const data = yield api.getSubCategoryItems(id)
        if (data.kind == "ok" && data.category.status == 200) {
          if (data.category.ok) {
            /** check index in array and push/relplace data object */
            let indexInAllMedia = findArrayObject(self.allSubCategoryMedia, id)
            if (indexInAllMedia == -1) {
              self.allSubCategoryMedia.push({ parent_id: id, data: data.category.data.data })
              self.loading = false
              return { response: true, message: string.ok }
            } else {
              self.allSubCategoryMedia[indexInAllMedia] = {
                parent_id: id,
                data: data.category.data.data,
              }
              self.loading = false
              return { response: true, message: string.ok }
            }
          } else {
            self.loading = false
            return { response: false, message: string.somethingWrong }
          }
        } else {
          self.loading = false
          return { response: false, message: string.somethingWrong }
        }
      } catch (error) {
        self.loading = false
        return { response: false, message: string.noInternet }
      }
      // self.loading = false
    }),

    /** set array for recently Viewed media */
    getRecentData(parentId, subcategoryId) {
      let AllDataIndex = findArrayObject(self.allSubCategoryMedia, parentId)
      let recentDataParentIndex = self.recentData.findIndex((x) => x.parent_id == parentId)
      let subIndex = self.allSubCategoryMedia[AllDataIndex].data.findIndex(
        (x) => x.id == subcategoryId,
      )
      /**  push data with parent id - if no data found for parent-id in array */
      if (recentDataParentIndex == -1) {
        self.recentData = self.recentData.concat({
          parent_id: parentId,
          children: [self.allSubCategoryMedia[AllDataIndex].data[subIndex]],
        })
      } else {
        /** parent found in array -> find index for that parent child */
        let NewArray = self.recentData[recentDataParentIndex].children
        let indexofRepeated = findRepeatedIndex(
          self.recentData[recentDataParentIndex].children,
          subcategoryId,
        )
        /** concat new child in parent if child not found */
        if (indexofRepeated == -1) {
          let data = NewArray.concat(self.allSubCategoryMedia[AllDataIndex].data[subIndex])
          self.recentData[recentDataParentIndex].children = data
        } else {
          /** replace child if found */
          self.recentData[recentDataParentIndex].children[indexofRepeated] =
            self.allSubCategoryMedia[AllDataIndex].data[subIndex]
        }
      }
    },

    setViewdMediaArray(mediaId: number) {
      if (self.seenMedia.indexOf(mediaId) === -1) {
        self.seenMedia.push(mediaId)
      }
    },
    removeViewedMediaArray(mediaId: number) {
      self.seenMedia.remove(mediaId)
    },

    /** get currently opened subCategory from all category array */
    getCurrentSubCategory(parent_id: number) {
      let currentSubcategoryIndex = findArrayObject(self.allSubCategoryMedia, parent_id)
      if (currentSubcategoryIndex != -1) {
        self.subCategory = self.allSubCategoryMedia[currentSubcategoryIndex].data
      }
    },

    /** get media of currently open subCategory */
    getMediaForSubcategory(idOfSubcategory: number, parent_id: number) {
      let indexForPerticularMedia = self.subCategory.findIndex((item) => item.id == idOfSubcategory)
      if (indexForPerticularMedia != -1) {
        self.mediaArray = self.subCategory[indexForPerticularMedia].media
      }
    },

    subcategoryMediaCleanup() {
      self.mediaArray = []
    },
    subcategoryCleanup() {
      self.subCategory = []
    },
    recentDataCleanup() {
      self.recentData = []
    },

    /** set index for active drawer item */
    setIndexForSubcategory(index: number) {
      self.indexForSubcategory = index
    },
  }))

/**  find index of subcategory */
function findArrayObject(array, parentId) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].parent_id == parentId) {
      return i
    }
  }
  return -1
}
function findRepeatedIndex(array, subIndex) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].id == subIndex) {
      return i
    }
  }
  return -1
}

type MediaStoreType = Instance<typeof MediaStoreModel>
export interface MediaStore extends MediaStoreType {}
type MediaStoreSnapshotType = SnapshotOut<typeof MediaStoreModel>
export interface MediaStoreSnapshot extends MediaStoreSnapshotType {}
