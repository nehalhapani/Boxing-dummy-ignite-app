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
      try {
        self.loading = true
        const data = yield api.getCategoryItems()
        self.category = data.category
        self.loading = false
      } catch (error) {
        self.loading = false
      }
    }),
  }))

/**
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type CategoryStoreType = Instance<typeof CategoryStoreModel>
export interface CategoryStore extends CategoryStoreType {}
type CategoryStoreSnapshotType = SnapshotOut<typeof CategoryStoreModel>
export interface CategoryStoreSnapshot extends CategoryStoreSnapshotType {}
