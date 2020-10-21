import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { Api } from "../../services/api"

const api = new Api()
api.setup()

export const MediaStoreModel = types
  .model("MediaStore")
  .props({
    allSubCategoryMedia: types.optional(types.array(types.frozen()), []),
    subCategory: types.optional(types.frozen(), []),
    mediaArray: types.optional(types.frozen(), []),
    indexForSubcategory: types.optional(types.integer, 0),
    recentData: types.optional(types.frozen(), []),
    seenMedia: types.optional(types.array(types.frozen()), []),
    loading: false,
  })

  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    // api call for sub category data
    getSubCategoryItems: flow(function* getSubCategoryItems(id: number) {
      try {
        self.loading = true
        const data = yield api.getSubCategoryItems(id)

        // check index in array and push/relplace data object
        let indexInAllMedia = findArrayObject(self.allSubCategoryMedia, id)
        if (indexInAllMedia == -1) {
          self.allSubCategoryMedia.push({ parent_id: id, data: data.category })
        } else {
          self.allSubCategoryMedia[indexInAllMedia] = { parent_id: id, data: data.category }
        }
        self.loading = false
      } catch (error) {
        self.loading = false
      }
    }),

    // set array for recently Viewed media
    getRecentData(parentId, subcategoryId) {
      let AllDataIndex = findArrayObject(self.allSubCategoryMedia, parentId)
      let recentDataParentIndex = self.recentData.findIndex((x) => x.parent_id == parentId)
      let subIndex = self.allSubCategoryMedia[AllDataIndex].data.findIndex(
        (x) => x.id == subcategoryId,
      )
      // push data with parent id - if no data found for parent-id in array
      if (recentDataParentIndex == -1) {
        self.recentData = self.recentData.concat({
          parent_id: parentId,
          children: [self.allSubCategoryMedia[AllDataIndex].data[subIndex]],
        })
      }
      // parent found in array -> find index for that parent child
      else {
        let NewArray = self.recentData[recentDataParentIndex].children
        let indexofRepeated = findRepeatedIndex(
          self.recentData[recentDataParentIndex].children,
          subcategoryId,
        )
        // concat new child in parent if child not found
        if (indexofRepeated == -1) {
          let data = NewArray.concat(self.allSubCategoryMedia[AllDataIndex].data[subIndex])
          self.recentData[recentDataParentIndex].children = data
        }
        // replace child if found
        else {
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

    // get currently opened subCategory from all category array
    getCurrentSubCategory(parent_id: number) {
      let currentSubcategoryIndex = findArrayObject(self.allSubCategoryMedia, parent_id)
      self.subCategory = self.allSubCategoryMedia[currentSubcategoryIndex].data
    },

    // get media of currently open subCategory
    getMediaForSubcategory(idOfSubcategory: number, parent_id: number) {
      let indexForPerticularMedia = self.subCategory.findIndex((item) => item.id == idOfSubcategory)
      self.mediaArray = self.subCategory[indexForPerticularMedia].media
    },

    subcategoryCleanup() {
      self.mediaArray = []
    },

    // set index for active drawer item
    setIndexForSubcategory(index: number) {
      self.indexForSubcategory = index
    },
  }))

// find index of subcategory
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
/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type MediaStoreType = Instance<typeof MediaStoreModel>
export interface MediaStore extends MediaStoreType {}
type MediaStoreSnapshotType = SnapshotOut<typeof MediaStoreModel>
export interface MediaStoreSnapshot extends MediaStoreSnapshotType {}
