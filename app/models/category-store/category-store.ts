import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { string } from "../../theme"
import { Api } from "../../services/api"

/**
 * Model for main category api call
 */
const api = new Api()
api.setup()

export const CategoryStoreModel = types
  .model("CategoryStore")
  .props({
    category: types.optional(types.frozen(), []),
    loading: false,
  })
  .views((self) => ({}))
  .actions((self) => ({
    /** api call for main category items */
    getCategoryItems: flow(function* getCategoryItems() {
      self.loading = true
      try {
        const data = yield api.getCategoryItems()
        if (data.kind == string.ok && data.category.status == 200) {
          if (data.category.ok) {
            self.category = data.category.data.data
            self.loading = false
            return { response: true, message: string.ok }
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
        return { response: false, message: string.somethingWrong }
      }
    }),
  }))

type CategoryStoreType = Instance<typeof CategoryStoreModel>
export interface CategoryStore extends CategoryStoreType {}
type CategoryStoreSnapshotType = SnapshotOut<typeof CategoryStoreModel>
export interface CategoryStoreSnapshot extends CategoryStoreSnapshotType {}
