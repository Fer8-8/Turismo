/*
  Warnings:

  - You are about to drop the `cdm_address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cdm_country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cdm_state` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cdm_address" DROP CONSTRAINT "cdm_address_state_id_fkey";

-- DropTable
DROP TABLE "cdm_address";

-- DropTable
DROP TABLE "cdm_country";

-- DropTable
DROP TABLE "cdm_state";

-- CreateTable
CREATE TABLE "cdm_countries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "iso_name" TEXT NOT NULL,
    "iso" TEXT NOT NULL,
    "iso3" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numcode" INTEGER NOT NULL,
    "states_required" BOOLEAN NOT NULL DEFAULT false,
    "zipcode_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_states" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "country_id" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cdm_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "state_name" TEXT,
    "alternative_phone" TEXT,
    "company" TEXT,
    "state_id" UUID NOT NULL,
    "country_id" UUID,
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "label" TEXT,

    CONSTRAINT "cdm_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "encrypted_password" TEXT,
    "password_salt" TEXT,
    "email" TEXT,
    "remember_token" TEXT,
    "persistence_token" TEXT,
    "reset_password_token" TEXT,
    "perishable_token" TEXT,
    "sign_in_count" INTEGER NOT NULL DEFAULT 0,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_request_at" TIMESTAMP(3),
    "current_sign_in_at" TIMESTAMP(3),
    "last_sign_in_at" TIMESTAMP(3),
    "current_sign_in_ip" TEXT,
    "last_sign_in_ip" TEXT,
    "login" TEXT,
    "ship_address_id" UUID,
    "bill_address_id" UUID,
    "authentication_token" TEXT,
    "unlock_token" TEXT,
    "locked_at" TIMESTAMP(3),
    "remember_created_at" TIMESTAMP(3),
    "reset_password_sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "available_on" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "slug" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "tax_category_id" UUID,
    "shipping_category_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "promotionable" BOOLEAN NOT NULL DEFAULT true,
    "meta_title" TEXT,
    "discontinue_on" TIMESTAMP(3),

    CONSTRAINT "cdm_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_variants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sku" TEXT NOT NULL DEFAULT '',
    "weight" DECIMAL(8,2),
    "height" DECIMAL(8,2),
    "width" DECIMAL(8,2),
    "depth" DECIMAL(8,2),
    "deleted_at" TIMESTAMP(3),
    "is_master" BOOLEAN NOT NULL DEFAULT false,
    "product_id" UUID,
    "cost_price" DECIMAL(10,2),
    "position" INTEGER,
    "cost_currency" TEXT,
    "track_inventory" BOOLEAN NOT NULL DEFAULT true,
    "tax_category_id" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "discontinue_on" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cdm_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_prices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "variant_id" UUID NOT NULL,
    "amount" DECIMAL(10,2),
    "currency" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "compare_at_amount" DECIMAL(10,2),

    CONSTRAINT "cdm_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_option_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "presentation" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "filterable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cdm_option_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_option_values" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "position" INTEGER,
    "name" TEXT,
    "presentation" TEXT,
    "option_type_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_option_value_variants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "variant_id" UUID,
    "option_value_id" UUID,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_option_value_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_product_option_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "position" INTEGER,
    "product_id" UUID,
    "option_type_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_product_option_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_stock_locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "state_id" UUID,
    "state_name" TEXT,
    "country_id" UUID,
    "zipcode" TEXT,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "backorderable_default" BOOLEAN NOT NULL DEFAULT false,
    "propagate_all_variants" BOOLEAN NOT NULL DEFAULT true,
    "admin_name" TEXT,

    CONSTRAINT "cdm_stock_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_stock_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stock_location_id" UUID,
    "variant_id" UUID,
    "count_on_hand" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "backorderable" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cdm_stock_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_stock_movements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stock_item_id" UUID,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "action" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "originator_type" TEXT,
    "originator_id" UUID,

    CONSTRAINT "cdm_stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_stock_transfers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT,
    "reference" TEXT,
    "source_location_id" UUID,
    "destination_location_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "number" TEXT,

    CONSTRAINT "cdm_stock_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "number" TEXT,
    "item_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "state" TEXT,
    "adjustment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "user_id" UUID,
    "completed_at" TIMESTAMP(3),
    "bill_address_id" UUID,
    "ship_address_id" UUID,
    "payment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "shipment_state" TEXT,
    "payment_state" TEXT,
    "email" TEXT,
    "special_instructions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "currency" TEXT,
    "last_ip_address" TEXT,
    "created_by_id" UUID,
    "shipment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "additional_tax_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "promo_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "channel" TEXT NOT NULL DEFAULT 'cdm',
    "included_tax_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "item_count" INTEGER NOT NULL DEFAULT 0,
    "approver_id" UUID,
    "approved_at" TIMESTAMP(3),
    "confirmation_delivered" BOOLEAN NOT NULL DEFAULT false,
    "considered_risky" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "canceled_at" TIMESTAMP(3),
    "canceler_id" UUID,
    "store_id" UUID,
    "state_lock_version" INTEGER NOT NULL DEFAULT 0,
    "taxable_adjustment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "non_taxable_adjustment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "store_owner_notification_delivered" BOOLEAN,

    CONSTRAINT "cdm_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_line_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "variant_id" UUID,
    "order_id" UUID,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "currency" TEXT,
    "cost_price" DECIMAL(10,2),
    "tax_category_id" UUID,
    "adjustment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "additional_tax_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "promo_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "included_tax_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "pre_tax_amount" DECIMAL(12,4) NOT NULL DEFAULT 0.0,
    "taxable_adjustment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "non_taxable_adjustment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,

    CONSTRAINT "cdm_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_inventory_units" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "state" TEXT,
    "variant_id" UUID,
    "order_id" UUID,
    "shipment_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "pending" BOOLEAN NOT NULL DEFAULT true,
    "line_item_id" UUID,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "original_return_item_id" UUID,

    CONSTRAINT "cdm_inventory_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_adjustments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_type" TEXT,
    "source_id" UUID,
    "adjustable_type" TEXT,
    "adjustable_id" UUID,
    "amount" DECIMAL(10,2),
    "label" TEXT,
    "mandatory" BOOLEAN,
    "eligible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" TEXT,
    "order_id" UUID NOT NULL,
    "included" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cdm_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_payment_methods" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT,
    "name" TEXT,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "display_on" TEXT NOT NULL DEFAULT 'both',
    "auto_capture" BOOLEAN,
    "preferences" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cdm_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_payment_methods_stores" (
    "payment_method_id" UUID NOT NULL,
    "store_id" UUID NOT NULL,

    CONSTRAINT "cdm_payment_methods_stores_pkey" PRIMARY KEY ("payment_method_id","store_id")
);

-- CreateTable
CREATE TABLE "cdm_payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "order_id" UUID,
    "source_type" TEXT,
    "source_id" UUID,
    "payment_method_id" UUID,
    "state" TEXT,
    "response_code" TEXT,
    "avs_response" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "number" TEXT,
    "cvv_response_code" TEXT,
    "cvv_response_message" TEXT,

    CONSTRAINT "cdm_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_payment_capture_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "payment_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_payment_capture_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_credit_cards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "month" TEXT,
    "year" TEXT,
    "cc_type" TEXT,
    "last_digits" TEXT,
    "address_id" UUID,
    "gateway_customer_profile_id" TEXT,
    "gateway_payment_profile_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "user_id" UUID,
    "payment_method_id" UUID,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cdm_credit_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_shipments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tracking" TEXT,
    "number" TEXT,
    "cost" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "shipped_at" TIMESTAMP(3),
    "order_id" UUID,
    "address_id" UUID,
    "state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stock_location_id" UUID,
    "adjustment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "additional_tax_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "promo_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "included_tax_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "pre_tax_amount" DECIMAL(12,4) NOT NULL DEFAULT 0.0,
    "taxable_adjustment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "non_taxable_adjustment_total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,

    CONSTRAINT "cdm_shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_shipping_methods" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "display_on" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tracking_url" TEXT,
    "admin_name" TEXT,
    "tax_category_id" UUID,
    "code" TEXT,

    CONSTRAINT "cdm_shipping_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_shipping_rates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shipment_id" UUID,
    "shipping_method_id" UUID,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "cost" DECIMAL(8,2) NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tax_rate_id" UUID,

    CONSTRAINT "cdm_shipping_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_shipping_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_shipping_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_shipping_method_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shipping_method_id" UUID NOT NULL,
    "shipping_category_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_shipping_method_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_promotions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT,
    "expires_at" TIMESTAMP(3),
    "starts_at" TIMESTAMP(3),
    "name" TEXT,
    "type" TEXT,
    "usage_limit" INTEGER,
    "match_policy" TEXT NOT NULL DEFAULT 'all',
    "code" TEXT,
    "advertise" BOOLEAN NOT NULL DEFAULT false,
    "path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "promotion_category_id" UUID,

    CONSTRAINT "cdm_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_promotion_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "code" TEXT,

    CONSTRAINT "cdm_promotion_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_promotion_actions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "promotion_id" UUID,
    "position" INTEGER,
    "type" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_promotion_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_promotion_action_line_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "promotion_action_id" UUID,
    "variant_id" UUID,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_promotion_action_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_promotion_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "promotion_id" UUID,
    "user_id" UUID,
    "product_group_id" UUID,
    "type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "code" TEXT,
    "preferences" TEXT,

    CONSTRAINT "cdm_promotion_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_product_promotion_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID,
    "promotion_rule_id" UUID,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_product_promotion_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_promotion_rule_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "promotion_rule_id" UUID,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_promotion_rule_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_order_promotions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID,
    "promotion_id" UUID,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_order_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_promotions_stores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "promotion_id" UUID,
    "store_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_promotions_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_customer_returns" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "number" TEXT,
    "stock_location_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "store_id" UUID,

    CONSTRAINT "cdm_customer_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_return_authorizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "number" TEXT,
    "state" TEXT,
    "order_id" UUID,
    "memo" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "stock_location_id" UUID,
    "return_authorization_reason_id" UUID,

    CONSTRAINT "cdm_return_authorizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_return_authorization_reasons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "mutable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_return_authorization_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_return_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "return_authorization_id" UUID,
    "inventory_unit_id" UUID,
    "exchange_variant_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "pre_tax_amount" DECIMAL(12,4) NOT NULL DEFAULT 0.0,
    "included_tax_total" DECIMAL(12,4) NOT NULL DEFAULT 0.0,
    "additional_tax_total" DECIMAL(12,4) NOT NULL DEFAULT 0.0,
    "reception_status" TEXT,
    "acceptance_status" TEXT,
    "customer_return_id" UUID,
    "reimbursement_id" UUID,
    "acceptance_status_errors" TEXT,
    "preferred_reimbursement_type_id" UUID,
    "override_reimbursement_type_id" UUID,
    "resellable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cdm_return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_reimbursements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "number" TEXT,
    "reimbursement_status" TEXT,
    "customer_return_id" UUID,
    "order_id" UUID,
    "total" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_reimbursements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_reimbursement_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "mutable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" TEXT,

    CONSTRAINT "cdm_reimbursement_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_reimbursement_credits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "reimbursement_id" UUID,
    "creditable_id" UUID,
    "creditable_type" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_reimbursement_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_refunds" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "payment_id" UUID,
    "amount" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "transaction_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "refund_reason_id" UUID,
    "reimbursement_id" UUID,

    CONSTRAINT "cdm_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_refund_reasons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "mutable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_refund_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_taxonomies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "store_id" UUID,

    CONSTRAINT "cdm_taxonomies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_taxons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "parent_id" UUID,
    "position" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "permalink" TEXT,
    "taxonomy_id" UUID,
    "lft" BIGINT,
    "rgt" BIGINT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "depth" INTEGER,
    "hide_from_nav" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cdm_taxons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_products_taxons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID,
    "taxon_id" UUID,
    "position" INTEGER,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_products_taxons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "presentation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "filterable" BOOLEAN NOT NULL DEFAULT false,
    "filter_param" TEXT,

    CONSTRAINT "cdm_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_product_properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "value" TEXT,
    "product_id" UUID,
    "property_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "show_property" BOOLEAN NOT NULL DEFAULT true,
    "filter_param" TEXT,

    CONSTRAINT "cdm_product_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_prototypes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_prototypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_option_type_prototypes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prototype_id" UUID,
    "option_type_id" UUID,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_option_type_prototypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_property_prototypes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prototype_id" UUID,
    "property_id" UUID,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_property_prototypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_tax_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "description" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tax_code" TEXT,

    CONSTRAINT "cdm_tax_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_tax_rates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DECIMAL(8,5),
    "zone_id" UUID,
    "tax_category_id" UUID,
    "included_in_price" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "show_rate_in_label" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cdm_tax_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_zones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "description" TEXT,
    "default_tax" BOOLEAN NOT NULL DEFAULT false,
    "zone_members_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'state',

    CONSTRAINT "cdm_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_zone_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "zoneable_type" TEXT,
    "zoneable_id" UUID,
    "zone_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_zone_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_stores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "url" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "seo_title" TEXT,
    "mail_from_address" TEXT,
    "default_currency" TEXT,
    "code" TEXT,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "supported_currencies" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "default_locale" TEXT,
    "customer_support_email" TEXT,
    "default_country_id" UUID,
    "description" TEXT,
    "address" TEXT,
    "contact_phone" TEXT,
    "new_order_notifications_email" TEXT,
    "checkout_zone_id" UUID,
    "seo_robots" TEXT,
    "supported_locales" TEXT,

    CONSTRAINT "cdm_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_products_stores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID,
    "store_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_products_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_store_credits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "category_id" UUID,
    "created_by_id" UUID,
    "amount" DECIMAL(8,2) NOT NULL DEFAULT 0.0,
    "amount_used" DECIMAL(8,2) NOT NULL DEFAULT 0.0,
    "memo" TEXT,
    "deleted_at" TIMESTAMP(3),
    "currency" TEXT,
    "amount_authorized" DECIMAL(8,2) NOT NULL DEFAULT 0.0,
    "originator_id" UUID,
    "originator_type" TEXT,
    "type_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "store_id" UUID,

    CONSTRAINT "cdm_store_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_store_credit_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_store_credit_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_store_credit_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "priority" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_store_credit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_store_credit_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "store_credit_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "amount" DECIMAL(8,2),
    "authorization_code" TEXT NOT NULL,
    "user_total_amount" DECIMAL(8,2) NOT NULL DEFAULT 0.0,
    "originator_id" UUID,
    "originator_type" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_store_credit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendly_id_slugs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "sluggable_id" UUID NOT NULL,
    "sluggable_type" TEXT,
    "scope" TEXT,
    "created_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "friendly_id_slugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "viewable_type" TEXT,
    "viewable_id" UUID,
    "attachment_width" INTEGER,
    "attachment_height" INTEGER,
    "attachment_file_size" INTEGER,
    "position" INTEGER,
    "attachment_content_type" TEXT,
    "attachment_file_name" TEXT,
    "type" TEXT,
    "attachment_updated_at" TIMESTAMP(3),
    "alt" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_calculators" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT,
    "calculable_type" TEXT,
    "calculable_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "preferences" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cdm_calculators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_gateways" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT,
    "name" TEXT,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "environment" TEXT NOT NULL DEFAULT 'development',
    "server" TEXT NOT NULL DEFAULT 'test',
    "test_mode" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "preferences" TEXT,

    CONSTRAINT "cdm_gateways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_log_entries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_type" TEXT,
    "source_id" UUID,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_log_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "value" TEXT,
    "key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_trackers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "analytics_id" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "engine" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cdm_trackers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_state_changes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "previous_state" TEXT,
    "stateful_id" UUID,
    "user_id" UUID,
    "stateful_type" TEXT,
    "next_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_state_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_role_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_id" UUID,
    "user_id" UUID,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cdm_role_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_postal_offices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "office_type" TEXT NOT NULL,
    "parent_office_id" UUID,
    "stock_location_id" UUID,
    "address_id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_postal_offices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_postal_guides" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "guide_number" TEXT NOT NULL,
    "guide_type" TEXT NOT NULL,
    "shipment_id" UUID NOT NULL,
    "origin_office_id" UUID NOT NULL,
    "destination_address_id" UUID NOT NULL,
    "current_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimated_delivery_at" TIMESTAMP(3),

    CONSTRAINT "cdm_postal_guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_postal_manifests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "manifest_number" TEXT NOT NULL,
    "origin_office_id" UUID NOT NULL,
    "destination_office_id" UUID NOT NULL,
    "vehicle_id" UUID,
    "driver_user_id" UUID,
    "status" TEXT,
    "departure_at" TIMESTAMP(3),
    "arrival_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cdm_postal_manifests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_postal_manifest_guides" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "manifest_id" UUID NOT NULL,
    "guide_id" UUID NOT NULL,
    "scanned_at" TIMESTAMP(3),

    CONSTRAINT "cdm_postal_manifest_guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_postal_vehicles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vehicle_type" TEXT NOT NULL,
    "plate_number" TEXT,
    "provider" TEXT,
    "base_office_id" UUID,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cdm_postal_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_postal_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "guide_id" UUID NOT NULL,
    "event_type" TEXT NOT NULL,
    "office_id" UUID NOT NULL,
    "user_id" UUID,
    "manifest_id" UUID,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "is_correction" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cdm_postal_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_postal_office_event_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "office_type" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,

    CONSTRAINT "cdm_postal_office_event_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cdm_postal_offices_code_key" ON "cdm_postal_offices"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cdm_postal_guides_guide_number_key" ON "cdm_postal_guides"("guide_number");

-- CreateIndex
CREATE UNIQUE INDEX "cdm_postal_guides_shipment_id_key" ON "cdm_postal_guides"("shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "cdm_postal_manifests_manifest_number_key" ON "cdm_postal_manifests"("manifest_number");

-- AddForeignKey
ALTER TABLE "cdm_states" ADD CONSTRAINT "cdm_states_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "cdm_countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_addresses" ADD CONSTRAINT "cdm_addresses_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "cdm_states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_addresses" ADD CONSTRAINT "cdm_addresses_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "cdm_countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_addresses" ADD CONSTRAINT "cdm_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cdm_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_users" ADD CONSTRAINT "cdm_users_ship_address_id_fkey" FOREIGN KEY ("ship_address_id") REFERENCES "cdm_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_users" ADD CONSTRAINT "cdm_users_bill_address_id_fkey" FOREIGN KEY ("bill_address_id") REFERENCES "cdm_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_products" ADD CONSTRAINT "cdm_products_tax_category_id_fkey" FOREIGN KEY ("tax_category_id") REFERENCES "cdm_tax_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_products" ADD CONSTRAINT "cdm_products_shipping_category_id_fkey" FOREIGN KEY ("shipping_category_id") REFERENCES "cdm_shipping_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_variants" ADD CONSTRAINT "cdm_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "cdm_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_variants" ADD CONSTRAINT "cdm_variants_tax_category_id_fkey" FOREIGN KEY ("tax_category_id") REFERENCES "cdm_tax_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_prices" ADD CONSTRAINT "cdm_prices_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "cdm_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_option_values" ADD CONSTRAINT "cdm_option_values_option_type_id_fkey" FOREIGN KEY ("option_type_id") REFERENCES "cdm_option_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_option_value_variants" ADD CONSTRAINT "cdm_option_value_variants_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "cdm_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_option_value_variants" ADD CONSTRAINT "cdm_option_value_variants_option_value_id_fkey" FOREIGN KEY ("option_value_id") REFERENCES "cdm_option_values"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_product_option_types" ADD CONSTRAINT "cdm_product_option_types_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "cdm_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_product_option_types" ADD CONSTRAINT "cdm_product_option_types_option_type_id_fkey" FOREIGN KEY ("option_type_id") REFERENCES "cdm_option_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_stock_locations" ADD CONSTRAINT "cdm_stock_locations_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "cdm_states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_stock_locations" ADD CONSTRAINT "cdm_stock_locations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "cdm_countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_stock_items" ADD CONSTRAINT "cdm_stock_items_stock_location_id_fkey" FOREIGN KEY ("stock_location_id") REFERENCES "cdm_stock_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_stock_items" ADD CONSTRAINT "cdm_stock_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "cdm_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_stock_movements" ADD CONSTRAINT "cdm_stock_movements_stock_item_id_fkey" FOREIGN KEY ("stock_item_id") REFERENCES "cdm_stock_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_stock_transfers" ADD CONSTRAINT "cdm_stock_transfers_source_location_id_fkey" FOREIGN KEY ("source_location_id") REFERENCES "cdm_stock_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_stock_transfers" ADD CONSTRAINT "cdm_stock_transfers_destination_location_id_fkey" FOREIGN KEY ("destination_location_id") REFERENCES "cdm_stock_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_orders" ADD CONSTRAINT "cdm_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cdm_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_orders" ADD CONSTRAINT "cdm_orders_bill_address_id_fkey" FOREIGN KEY ("bill_address_id") REFERENCES "cdm_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_orders" ADD CONSTRAINT "cdm_orders_ship_address_id_fkey" FOREIGN KEY ("ship_address_id") REFERENCES "cdm_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_orders" ADD CONSTRAINT "cdm_orders_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "cdm_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_line_items" ADD CONSTRAINT "cdm_line_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "cdm_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_line_items" ADD CONSTRAINT "cdm_line_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "cdm_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_line_items" ADD CONSTRAINT "cdm_line_items_tax_category_id_fkey" FOREIGN KEY ("tax_category_id") REFERENCES "cdm_tax_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_inventory_units" ADD CONSTRAINT "cdm_inventory_units_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "cdm_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_inventory_units" ADD CONSTRAINT "cdm_inventory_units_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "cdm_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_inventory_units" ADD CONSTRAINT "cdm_inventory_units_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "cdm_shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_inventory_units" ADD CONSTRAINT "cdm_inventory_units_line_item_id_fkey" FOREIGN KEY ("line_item_id") REFERENCES "cdm_line_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_adjustments" ADD CONSTRAINT "cdm_adjustments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "cdm_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_payment_methods_stores" ADD CONSTRAINT "cdm_payment_methods_stores_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "cdm_payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_payment_methods_stores" ADD CONSTRAINT "cdm_payment_methods_stores_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "cdm_stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_payments" ADD CONSTRAINT "cdm_payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "cdm_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_payments" ADD CONSTRAINT "cdm_payments_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "cdm_payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_payment_capture_events" ADD CONSTRAINT "cdm_payment_capture_events_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "cdm_payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_credit_cards" ADD CONSTRAINT "cdm_credit_cards_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "cdm_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_credit_cards" ADD CONSTRAINT "cdm_credit_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cdm_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_credit_cards" ADD CONSTRAINT "cdm_credit_cards_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "cdm_payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_shipments" ADD CONSTRAINT "cdm_shipments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "cdm_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_shipments" ADD CONSTRAINT "cdm_shipments_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "cdm_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_shipments" ADD CONSTRAINT "cdm_shipments_stock_location_id_fkey" FOREIGN KEY ("stock_location_id") REFERENCES "cdm_stock_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_shipping_methods" ADD CONSTRAINT "cdm_shipping_methods_tax_category_id_fkey" FOREIGN KEY ("tax_category_id") REFERENCES "cdm_tax_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_shipping_rates" ADD CONSTRAINT "cdm_shipping_rates_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "cdm_shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_shipping_rates" ADD CONSTRAINT "cdm_shipping_rates_shipping_method_id_fkey" FOREIGN KEY ("shipping_method_id") REFERENCES "cdm_shipping_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_shipping_rates" ADD CONSTRAINT "cdm_shipping_rates_tax_rate_id_fkey" FOREIGN KEY ("tax_rate_id") REFERENCES "cdm_tax_rates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_shipping_method_categories" ADD CONSTRAINT "cdm_shipping_method_categories_shipping_method_id_fkey" FOREIGN KEY ("shipping_method_id") REFERENCES "cdm_shipping_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_shipping_method_categories" ADD CONSTRAINT "cdm_shipping_method_categories_shipping_category_id_fkey" FOREIGN KEY ("shipping_category_id") REFERENCES "cdm_shipping_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_promotions" ADD CONSTRAINT "cdm_promotions_promotion_category_id_fkey" FOREIGN KEY ("promotion_category_id") REFERENCES "cdm_promotion_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_promotion_actions" ADD CONSTRAINT "cdm_promotion_actions_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "cdm_promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_promotion_action_line_items" ADD CONSTRAINT "cdm_promotion_action_line_items_promotion_action_id_fkey" FOREIGN KEY ("promotion_action_id") REFERENCES "cdm_promotion_actions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_promotion_action_line_items" ADD CONSTRAINT "cdm_promotion_action_line_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "cdm_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_promotion_rules" ADD CONSTRAINT "cdm_promotion_rules_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "cdm_promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_product_promotion_rules" ADD CONSTRAINT "cdm_product_promotion_rules_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "cdm_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_product_promotion_rules" ADD CONSTRAINT "cdm_product_promotion_rules_promotion_rule_id_fkey" FOREIGN KEY ("promotion_rule_id") REFERENCES "cdm_promotion_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_promotion_rule_users" ADD CONSTRAINT "cdm_promotion_rule_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cdm_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_promotion_rule_users" ADD CONSTRAINT "cdm_promotion_rule_users_promotion_rule_id_fkey" FOREIGN KEY ("promotion_rule_id") REFERENCES "cdm_promotion_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_order_promotions" ADD CONSTRAINT "cdm_order_promotions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "cdm_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_order_promotions" ADD CONSTRAINT "cdm_order_promotions_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "cdm_promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_promotions_stores" ADD CONSTRAINT "cdm_promotions_stores_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "cdm_promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_promotions_stores" ADD CONSTRAINT "cdm_promotions_stores_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "cdm_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_customer_returns" ADD CONSTRAINT "cdm_customer_returns_stock_location_id_fkey" FOREIGN KEY ("stock_location_id") REFERENCES "cdm_stock_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_customer_returns" ADD CONSTRAINT "cdm_customer_returns_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "cdm_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_return_authorizations" ADD CONSTRAINT "cdm_return_authorizations_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "cdm_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_return_authorizations" ADD CONSTRAINT "cdm_return_authorizations_stock_location_id_fkey" FOREIGN KEY ("stock_location_id") REFERENCES "cdm_stock_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_return_authorizations" ADD CONSTRAINT "cdm_return_authorizations_return_authorization_reason_id_fkey" FOREIGN KEY ("return_authorization_reason_id") REFERENCES "cdm_return_authorization_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_return_items" ADD CONSTRAINT "cdm_return_items_return_authorization_id_fkey" FOREIGN KEY ("return_authorization_id") REFERENCES "cdm_return_authorizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_return_items" ADD CONSTRAINT "cdm_return_items_inventory_unit_id_fkey" FOREIGN KEY ("inventory_unit_id") REFERENCES "cdm_inventory_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_return_items" ADD CONSTRAINT "cdm_return_items_exchange_variant_id_fkey" FOREIGN KEY ("exchange_variant_id") REFERENCES "cdm_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_return_items" ADD CONSTRAINT "cdm_return_items_customer_return_id_fkey" FOREIGN KEY ("customer_return_id") REFERENCES "cdm_customer_returns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_return_items" ADD CONSTRAINT "cdm_return_items_reimbursement_id_fkey" FOREIGN KEY ("reimbursement_id") REFERENCES "cdm_reimbursements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_return_items" ADD CONSTRAINT "cdm_return_items_preferred_reimbursement_type_id_fkey" FOREIGN KEY ("preferred_reimbursement_type_id") REFERENCES "cdm_reimbursement_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_return_items" ADD CONSTRAINT "cdm_return_items_override_reimbursement_type_id_fkey" FOREIGN KEY ("override_reimbursement_type_id") REFERENCES "cdm_reimbursement_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_reimbursements" ADD CONSTRAINT "cdm_reimbursements_customer_return_id_fkey" FOREIGN KEY ("customer_return_id") REFERENCES "cdm_customer_returns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_reimbursements" ADD CONSTRAINT "cdm_reimbursements_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "cdm_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_reimbursement_credits" ADD CONSTRAINT "cdm_reimbursement_credits_reimbursement_id_fkey" FOREIGN KEY ("reimbursement_id") REFERENCES "cdm_reimbursements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_refunds" ADD CONSTRAINT "cdm_refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "cdm_payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_refunds" ADD CONSTRAINT "cdm_refunds_refund_reason_id_fkey" FOREIGN KEY ("refund_reason_id") REFERENCES "cdm_refund_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_refunds" ADD CONSTRAINT "cdm_refunds_reimbursement_id_fkey" FOREIGN KEY ("reimbursement_id") REFERENCES "cdm_reimbursements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_taxonomies" ADD CONSTRAINT "cdm_taxonomies_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "cdm_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_taxons" ADD CONSTRAINT "cdm_taxons_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "cdm_taxons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_taxons" ADD CONSTRAINT "cdm_taxons_taxonomy_id_fkey" FOREIGN KEY ("taxonomy_id") REFERENCES "cdm_taxonomies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_products_taxons" ADD CONSTRAINT "cdm_products_taxons_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "cdm_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_products_taxons" ADD CONSTRAINT "cdm_products_taxons_taxon_id_fkey" FOREIGN KEY ("taxon_id") REFERENCES "cdm_taxons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_product_properties" ADD CONSTRAINT "cdm_product_properties_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "cdm_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_product_properties" ADD CONSTRAINT "cdm_product_properties_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "cdm_properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_option_type_prototypes" ADD CONSTRAINT "cdm_option_type_prototypes_prototype_id_fkey" FOREIGN KEY ("prototype_id") REFERENCES "cdm_prototypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_option_type_prototypes" ADD CONSTRAINT "cdm_option_type_prototypes_option_type_id_fkey" FOREIGN KEY ("option_type_id") REFERENCES "cdm_option_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_property_prototypes" ADD CONSTRAINT "cdm_property_prototypes_prototype_id_fkey" FOREIGN KEY ("prototype_id") REFERENCES "cdm_prototypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_property_prototypes" ADD CONSTRAINT "cdm_property_prototypes_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "cdm_properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_tax_rates" ADD CONSTRAINT "cdm_tax_rates_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "cdm_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_tax_rates" ADD CONSTRAINT "cdm_tax_rates_tax_category_id_fkey" FOREIGN KEY ("tax_category_id") REFERENCES "cdm_tax_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_zone_members" ADD CONSTRAINT "cdm_zone_members_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "cdm_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_stores" ADD CONSTRAINT "cdm_stores_default_country_id_fkey" FOREIGN KEY ("default_country_id") REFERENCES "cdm_countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_stores" ADD CONSTRAINT "cdm_stores_checkout_zone_id_fkey" FOREIGN KEY ("checkout_zone_id") REFERENCES "cdm_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_products_stores" ADD CONSTRAINT "cdm_products_stores_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "cdm_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_products_stores" ADD CONSTRAINT "cdm_products_stores_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "cdm_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_store_credits" ADD CONSTRAINT "cdm_store_credits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cdm_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_store_credits" ADD CONSTRAINT "cdm_store_credits_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "cdm_store_credit_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_store_credits" ADD CONSTRAINT "cdm_store_credits_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "cdm_store_credit_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_store_credits" ADD CONSTRAINT "cdm_store_credits_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "cdm_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_store_credit_events" ADD CONSTRAINT "cdm_store_credit_events_store_credit_id_fkey" FOREIGN KEY ("store_credit_id") REFERENCES "cdm_store_credits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_state_changes" ADD CONSTRAINT "cdm_state_changes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cdm_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_role_users" ADD CONSTRAINT "cdm_role_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "cdm_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_role_users" ADD CONSTRAINT "cdm_role_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cdm_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_offices" ADD CONSTRAINT "cdm_postal_offices_parent_office_id_fkey" FOREIGN KEY ("parent_office_id") REFERENCES "cdm_postal_offices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_offices" ADD CONSTRAINT "cdm_postal_offices_stock_location_id_fkey" FOREIGN KEY ("stock_location_id") REFERENCES "cdm_stock_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_offices" ADD CONSTRAINT "cdm_postal_offices_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "cdm_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_guides" ADD CONSTRAINT "cdm_postal_guides_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "cdm_shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_guides" ADD CONSTRAINT "cdm_postal_guides_origin_office_id_fkey" FOREIGN KEY ("origin_office_id") REFERENCES "cdm_postal_offices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_guides" ADD CONSTRAINT "cdm_postal_guides_destination_address_id_fkey" FOREIGN KEY ("destination_address_id") REFERENCES "cdm_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_manifests" ADD CONSTRAINT "cdm_postal_manifests_origin_office_id_fkey" FOREIGN KEY ("origin_office_id") REFERENCES "cdm_postal_offices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_manifests" ADD CONSTRAINT "cdm_postal_manifests_destination_office_id_fkey" FOREIGN KEY ("destination_office_id") REFERENCES "cdm_postal_offices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_manifests" ADD CONSTRAINT "cdm_postal_manifests_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "cdm_postal_vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_manifests" ADD CONSTRAINT "cdm_postal_manifests_driver_user_id_fkey" FOREIGN KEY ("driver_user_id") REFERENCES "cdm_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_manifest_guides" ADD CONSTRAINT "cdm_postal_manifest_guides_manifest_id_fkey" FOREIGN KEY ("manifest_id") REFERENCES "cdm_postal_manifests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_manifest_guides" ADD CONSTRAINT "cdm_postal_manifest_guides_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "cdm_postal_guides"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_vehicles" ADD CONSTRAINT "cdm_postal_vehicles_base_office_id_fkey" FOREIGN KEY ("base_office_id") REFERENCES "cdm_postal_offices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_events" ADD CONSTRAINT "cdm_postal_events_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "cdm_postal_guides"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_events" ADD CONSTRAINT "cdm_postal_events_office_id_fkey" FOREIGN KEY ("office_id") REFERENCES "cdm_postal_offices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_events" ADD CONSTRAINT "cdm_postal_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cdm_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdm_postal_events" ADD CONSTRAINT "cdm_postal_events_manifest_id_fkey" FOREIGN KEY ("manifest_id") REFERENCES "cdm_postal_manifests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
