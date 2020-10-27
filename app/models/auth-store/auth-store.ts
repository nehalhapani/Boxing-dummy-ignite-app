import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model for logged user token and details management
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    isTokenSet: types.optional(types.boolean, false),
    userData: types.optional(types.frozen(), []),
    loading: types.optional(types.boolean, false),
  })
  .views((self) => ({}))
  .actions((self) => ({
    /** set logged user token */
    setToken() {
      self.isTokenSet = true
    },

    /** set logged user detail */
    setUserData(data) {
      self.userData = data
    },

    /** remove token , user details on logout */
    removeToken() {
      self.isTokenSet = false
      self.userData = []
    },
  }))

type AuthStoreType = Instance<typeof AuthStoreModel>
export interface AuthStore extends AuthStoreType {}
type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>
export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}
