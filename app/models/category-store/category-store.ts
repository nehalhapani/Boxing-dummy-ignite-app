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
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    // api call for main category items
    getCategoryItems: flow(function* getCategoryItems() {
      self.loading = true
      try {
        const data = yield api.getCategoryItems()
        if (data.kind == "ok" && data.category.status == 200) {
          if (data.category.ok) {
            self.category = data.category.data.data
            self.loading = false
          }
        } else {
          self.loading = false
          return { response: false, message: "Something went wrong! Please try again later." }
        }
      } catch (error) {
        self.loading = false
        return { response: false, message: "Something went wrong! Please try again later." }
      }
      self.loading = false
      return { response: false, message: "Something went wrong! Please try again later." }
    }),
  }))

/**
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type CategoryStoreType = Instance<typeof CategoryStoreModel>
export interface CategoryStore extends CategoryStoreType {}
type CategoryStoreSnapshotType = SnapshotOut<typeof CategoryStoreModel>
export interface CategoryStoreSnapshot extends CategoryStoreSnapshotType {}
