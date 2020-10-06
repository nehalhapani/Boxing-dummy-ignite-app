import { CategoryStoreModel, CategoryStore } from "./category-store"

test("can be created", () => {
  const instance: CategoryStore = CategoryStoreModel.create({})

  expect(instance).toBeTruthy()
})