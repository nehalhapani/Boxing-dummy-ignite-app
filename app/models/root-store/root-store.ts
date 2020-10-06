import { MediaStoreModel } from "../media-store/media-store"
import { SubCategoryStoreModel } from "../sub-category-store/sub-category-store"
import { CategoryStoreModel } from "../category-store/category-store"
import { AuthStoreModel } from "../auth-store/auth-store"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  mediaStore: types.optional(MediaStoreModel, {}),
  subCategoryStore: types.optional(SubCategoryStoreModel, {}),
  categoryStore: types.optional(CategoryStoreModel, {}),
  authStore: types.optional(AuthStoreModel, {}),

})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
