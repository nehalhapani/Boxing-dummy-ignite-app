import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { Api } from "../../services/api"

/**
 * Model description here for TypeScript hints.
 */
const api = new Api()
api.setup()

export const MediaStoreModel = types
  .model("MediaStore")
  .props({
    allSubCategoryMedia: types.optional(types.array(types.frozen()), []),
    subCategory: types.optional(types.frozen(), []),
    mediaArray: types.optional(types.frozen(), []),
    indexForSubcategory: types.optional(types.integer, 0),
    loading: false,
  })

  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getSubCategoryItems: flow(function* getSubCategoryItems(id: number) {
      try {
        self.loading = true
        const data = yield api.getSubCategoryItems(id)
        console.tron.log("api data ===>", data)

        // check index in array and push/relplace data object
        let indexInAllMedia = findArrayObject(self.allSubCategoryMedia, id)
        if (indexInAllMedia == -1) {
          self.allSubCategoryMedia.push({ parent_id: id, data: data.category })
          console.tron.log("all media", self.allSubCategoryMedia)
        } else {
          self.allSubCategoryMedia[indexInAllMedia] = { parent_id: id, data: data.category }
        }
        console.tron.log("all media", self.allSubCategoryMedia)
        self.loading = false
      } catch (error) {
        console.tron.log(error)
        self.loading = false
      }
    }),

    // get currently opened subCategory from all category array
    getCurrentSubCategory(parent_id: number) {
      let currentMediaIndex = findArrayObject(self.allSubCategoryMedia, parent_id)
      console.tron.log(currentMediaIndex, parent_id)
      self.subCategory = self.allSubCategoryMedia[currentMediaIndex].data
      console.tron.log("sub category data", self.subCategory)
    },

    // get media of currently open subCategory
    getMediaForSubcategory(idOfSubcategory: number) {
      let indexForPerticularMedia = self.subCategory.findIndex((item) => item.id == idOfSubcategory)
      self.mediaArray = self.subCategory[indexForPerticularMedia].media
      console.tron.log("media", self.mediaArray)
    },

    subcategoryCleanup() {
      self.mediaArray = []
    },

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
