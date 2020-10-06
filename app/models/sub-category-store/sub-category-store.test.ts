import { SubCategoryStoreModel, SubCategoryStore } from "./sub-category-store"

test("can be created", () => {
  const instance: SubCategoryStore = SubCategoryStoreModel.create({})

  expect(instance).toBeTruthy()
})