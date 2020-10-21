import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    isTokenSet: types.optional(types.boolean, false),
    userData: types.optional(types.frozen(), []),
    loading: types.optional(types.boolean, false),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    // set logged user token
    setToken() {
      self.isTokenSet = true
    },

    // set logged user detail
    setUserData(data) {
      self.userData = data
    },

    // remove token , user details on logout
    removeToken() {
      self.isTokenSet = false
      self.userData = []
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type AuthStoreType = Instance<typeof AuthStoreModel>
export interface AuthStore extends AuthStoreType {}
type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>
export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}
