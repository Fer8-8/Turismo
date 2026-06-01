import type { CATEGORIES } from "../constants/categories";

export type Category = (typeof CATEGORIES)[number];
export type CategoryId = Category["id"];
