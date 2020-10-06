import { MediaStoreModel, MediaStore } from "./media-store"

test("can be created", () => {
  const instance: MediaStore = MediaStoreModel.create({})

  expect(instance).toBeTruthy()
})