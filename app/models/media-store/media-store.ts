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
    mediaArray: types.optional(types.frozen(), null),
    loading: false,
    subCategory: types.optional(types.frozen(), null),
    indexForSubcategory: types.optional(types.integer, 0),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getMediaImage: flow(function* getMediaImage(id: number) {
      try {
        self.loading = true
        const data = yield api.getMediaImage(id)
        console.log("api image data ===>", data)
        self.mediaArray = data.category
        console.log("img in store ===>", self.mediaArray)
        self.loading = false
      } catch (error) {
        console.log(error)
        self.loading = false
      }
    }),
    getSubCategoryItems: flow(function* getSubCategoryItems(id: number) {
      try {
        self.loading = true
        const data = yield api.getSubCategoryItems(id)
        console.log("api data ===>", data)
        self.subCategory = data.category
        console.log("subcategory in store ^^^^===>", self.subCategory)
        self.loading = false
      } catch (error) {
        console.log(error)
        self.loading = false
      }
    }),

    getMediaForSubcategory(idOfSubcategory: number) {
      let indexForPerticularMedia = self.subCategory.findIndex((item) => item.id == idOfSubcategory)
      self.mediaArray = self.subCategory[indexForPerticularMedia]
    },

    setIndexForSubcategory(index: number) {
      self.indexForSubcategory = index
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

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
