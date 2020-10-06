import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { Api } from "../../services/api"

/**
 * Model description here for TypeScript hints.
 */
const api = new Api()
api.setup()

export const CategoryStoreModel = types
  .model("CategoryStore")
  .props({
    category: types.optional(types.frozen(), {}),
    loading: false,
    // indexForSubcategory: types.optional(types.integer, 0),
    // subCategory: types.optional(types.frozen(), null),
    //mediaImage: types.optional(types.frozen(), null),
    // categoryId: types.optional(types.integer, {}),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getCategoryItems: flow(function* getCategoryItems() {
      try {
        self.loading = true
        const data = yield api.getCategoryItems()
        self.category = data.category
        self.loading = false
      } catch (error) {
        self.loading = false
      }
    }),

    // getSubCategoryItems: flow(function* getSubCategoryItems(id: number) {
    //   try {
    //     self.loading = true
    //     const data = yield api.getSubCategoryItems(id)
    //     console.log("api data ===>", data)
    //     self.subCategory = data.category
    //     console.log("subcategory in store ===>", self.subCategory)
    //     self.loading = false
    //   } catch (error) {
    //     console.log(error)
    //     self.loading = false
    //   }
    // }),

    // getMediaImage: flow(function* getMediaImage(id: number) {
    //   try {
    //     self.loading = true
    //     const data = yield api.getMediaImage(id)
    //     console.log("api image data ===>", data)
    //     self.mediaImage = data.category
    //     console.log("img in store ===>", self.mediaImage)
    //     self.loading = false
    //   } catch (error) {
    //     console.log(error)
    //     self.loading = false
    //   }
    // }),

    // setIndexForSubcategory(index: number) {
    //   self.indexForSubcategory = index
    // },
  }))

/**
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type CategoryStoreType = Instance<typeof CategoryStoreModel>
export interface CategoryStore extends CategoryStoreType {}
type CategoryStoreSnapshotType = SnapshotOut<typeof CategoryStoreModel>
export interface CategoryStoreSnapshot extends CategoryStoreSnapshotType {}
