import { GeneralApiProblem } from "./api-problem"
import { CategoryStore } from "../../models"

export interface User {
  id: number
  name: string
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
export type GetCategoryResult = { kind: "ok"; category: any } | GeneralApiProblem
