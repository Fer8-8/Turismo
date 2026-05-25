export interface PromotionListFilter {
  active?: boolean;
  storeId?: string;
  since?: Date;
  until?: Date;
  code?: string;
  name?: string;
  categoryId?: string;
  page?: number;
  take?: number;
}

export interface CreatePromotionInput {
  name?: string;
  description?: string;
  type?: string;
  code?: string;
  match_policy?: string;
  starts_at?: Date | null;
  expires_at?: Date | null;
  usage_limit?: number | null;
  advertise?: boolean;
  path?: string;
  promotion_category_id?: string | null;
  store_ids?: string[];
}

export interface UpdatePromotionInput {
  name?: string;
  description?: string;
  type?: string;
  code?: string;
  match_policy?: string;
  starts_at?: Date | null;
  expires_at?: Date | null;
  usage_limit?: number | null;
  advertise?: boolean;
  path?: string;
  promotion_category_id?: string | null;
}

export interface CreatePromotionRuleInput {
  promotion_id: string;
  type: string;
  code?: string | null;
  preferences?: string | null;
  product_ids?: string[];
  user_ids?: string[];
}

export interface UpdatePromotionRuleInput {
  type?: string;
  code?: string | null;
  preferences?: string | null;
}

export interface CreatePromotionActionInput {
  promotion_id: string;
  type: string;
  preferences: string;
  position?: number | null;
}

export interface UpdatePromotionActionInput {
  type?: string;
  preferences?: string;
  position?: number | null;
}

export interface CreatePromotionCategoryInput {
  name: string;
  code?: string | null;
}

export interface UpdatePromotionCategoryInput {
  name?: string;
  code?: string | null;
}

export interface LinkPromotionToOrderInput {
  order_id: string;
  promotion_id: string;
  promo_total?: number;
  reason?: string | null;
  evaluation_snapshot?: string | null;
}