type MaybeNumber = { toNumber?: () => number } | number | string | null | undefined;

function toNumber(value: MaybeNumber): number {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return Number(value);
  }

  return value.toNumber?.() ?? Number(value);
}

function serializeConfiguration(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return JSON.stringify(value);
}

export function serializeShippingMethod(method: any) {
  return {
    ...method,
    configuration: serializeConfiguration(method.configuration),
    shippingMethodCategories: method.shippingMethodCategories ?? [],
  };
}

export function serializeShippingCategory(category: any) {
  return {
    ...category,
    shippingMethodCategories: category.shippingMethodCategories ?? [],
  };
}

export function serializeShippingRate(rate: any, taxRate?: any | null) {
  const baseCost = toNumber(rate.cost);
  const taxAmount = taxRate?.amount ? toNumber(taxRate.amount) : 0;
  const includedInPrice = Boolean(taxRate?.included_in_price);

  const includedTaxTotal = includedInPrice ? parseFloat((baseCost - baseCost / (1 + taxAmount)).toFixed(2)) : 0;
  const additionalTaxTotal = !includedInPrice && taxAmount > 0
    ? parseFloat((baseCost * taxAmount).toFixed(2))
    : 0;

  return {
    ...rate,
    cost: baseCost,
    tax_rate_id: rate.tax_rate_id ?? null,
    tax_amount: taxAmount,
    included_tax_total: includedTaxTotal,
    additional_tax_total: additionalTaxTotal,
    shippingMethod: rate.shippingMethod ? serializeShippingMethod(rate.shippingMethod) : null,
    taxRate: taxRate
      ? {
          id: taxRate.id,
          name: taxRate.name ?? null,
          amount: taxAmount,
          included_in_price: Boolean(taxRate.included_in_price),
        }
      : null,
  };
}

export function serializeShipment(shipment: any, rates: any[] = shipment.shippingRates ?? []) {
  return {
    ...shipment,
    cost: toNumber(shipment.cost),
    adjustment_total: toNumber(shipment.adjustment_total),
    additional_tax_total: toNumber(shipment.additional_tax_total),
    promo_total: toNumber(shipment.promo_total),
    included_tax_total: toNumber(shipment.included_tax_total),
    pre_tax_amount: toNumber(shipment.pre_tax_amount),
    taxable_adjustment_total: toNumber(shipment.taxable_adjustment_total),
    non_taxable_adjustment_total: toNumber(shipment.non_taxable_adjustment_total),
    shippingRates: rates,
    selected_shipping_rate_id:
      rates.find((rate) => rate.selected)?.id ?? null,
  };
}

export function serializeTrackingView(shipment: any) {
  return {
    shipmentId: shipment.id,
    tracking: shipment.tracking ?? null,
    state: shipment.state ?? null,
    shippedAt: shipment.shipped_at ?? null,
    deliveredAt: shipment.delivered_at ?? null,
  };
}

export function serializeReturnAuthorizationReason(reason: any) {
  return {
    ...reason,
    active: Boolean(reason.active),
    mutable: Boolean(reason.mutable),
  };
}

export function serializeReturnItem(item: any) {
  return {
    ...item,
    pre_tax_amount: toNumber(item.pre_tax_amount),
    included_tax_total: toNumber(item.included_tax_total),
    additional_tax_total: toNumber(item.additional_tax_total),
    resellable: Boolean(item.resellable),
    inventoryUnit: item.inventoryUnit ?? null,
    customerReturn: item.customerReturn ? serializeCustomerReturn(item.customerReturn, false) : null,
    returnAuthorization: item.returnAuthorization
      ? {
          id: item.returnAuthorization.id,
          number: item.returnAuthorization.number ?? null,
          state: item.returnAuthorization.state ?? null,
          order_id: item.returnAuthorization.order_id ?? null,
        }
      : null,
  };
}

export function serializeCustomerReturn(customerReturn: any, includeItems = true) {
  return {
    ...customerReturn,
    returnItems: includeItems
      ? (customerReturn.returnItems ?? []).map((item: any) => serializeReturnItem(item))
      : [],
  };
}

export function serializeReturnAuthorization(authorization: any) {
  return {
    ...authorization,
    returnAuthorizationReason: authorization.returnAuthorizationReason
      ? serializeReturnAuthorizationReason(authorization.returnAuthorizationReason)
      : null,
    returnItems: (authorization.returnItems ?? []).map((item: any) => serializeReturnItem(item)),
  };
}

export function calculateShipmentTaxBreakdown(cost: number, taxRate?: any | null) {
  if (!taxRate?.amount) {
    return {
      cost,
      pre_tax_amount: cost,
      included_tax_total: 0,
      additional_tax_total: 0,
    };
  }

  const rateAmount = toNumber(taxRate.amount);
  const includedInPrice = Boolean(taxRate.included_in_price);

  if (includedInPrice) {
    const preTax = parseFloat((cost / (1 + rateAmount)).toFixed(4));
    const includedTax = parseFloat((cost - preTax).toFixed(2));

    return {
      cost,
      pre_tax_amount: preTax,
      included_tax_total: includedTax,
      additional_tax_total: 0,
    };
  }

  return {
    cost,
    pre_tax_amount: cost,
    included_tax_total: 0,
    additional_tax_total: parseFloat((cost * rateAmount).toFixed(2)),
  };
}

// ─── serializadores de reembolso ──────────────────────────────────────────────

type DecimalLike = {
  toString(): string;
  toNumber?(): number;
};

type ReimbursementTypeSummaryRecord = {
  id: string;
  name: string | null;
  type: string | null;
};

type ReimbursementItemSummaryRecord = {
  id: string;
  return_authorization_id: string | null;
  inventory_unit_id: string | null;
  customer_return_id: string | null;
  reimbursement_id: string | null;
  acceptance_status: string | null;
  reception_status: string | null;
  pre_tax_amount: number | string | DecimalLike | null;
  included_tax_total: number | string | DecimalLike | null;
  additional_tax_total: number | string | DecimalLike | null;
  resellable: boolean | null;
  preferred_reimbursement_type_id: string | null;
  override_reimbursement_type_id: string | null;
  preferredReimbursementType?: ReimbursementTypeSummaryRecord | null;
  overrideReimbursementType?: ReimbursementTypeSummaryRecord | null;
  created_at: Date;
  updated_at: Date;
};

type ReimbursementRefundSummaryRecord = {
  id: string;
  amount: number | string | DecimalLike | null;
  state: string | null;
  transaction_id: string | null;
  created_at: Date | null;
};

type ReimbursementCreditRecord = {
  id: string;
  reimbursement_id: string | null;
  amount: number | string | DecimalLike | null;
  creditable_id: string | null;
  creditable_type: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

type ReimbursementRecord = {
  id: string;
  number: string | null;
  reimbursement_status: string | null;
  order_id: string | null;
  customer_return_id: string | null;
  total: number | string | DecimalLike | null;
  created_at: Date;
  updated_at: Date;
  reimbursementCredits?: ReimbursementCreditRecord[] | null;
  returnItems?: ReimbursementItemSummaryRecord[] | null;
  refunds?: ReimbursementRefundSummaryRecord[] | null;
  order?: { id: string; number: string | null } | null;
  customerReturn?: { id: string; number: string | null } | null;
};

type ReimbursementTypeRecord = {
  id: string;
  name: string | null;
  active: boolean | null;
  mutable: boolean | null;
  type: string | null;
  created_at: Date;
  updated_at: Date;
};

function serializeReimbursementItemSummary(item: ReimbursementItemSummaryRecord) {
  const effectiveTypeId =
    item.override_reimbursement_type_id ?? item.preferred_reimbursement_type_id ?? null;

  return {
    id: item.id,
    return_authorization_id: item.return_authorization_id ?? null,
    inventory_unit_id: item.inventory_unit_id ?? null,
    customer_return_id: item.customer_return_id ?? null,
    reimbursement_id: item.reimbursement_id ?? null,
    acceptance_status: item.acceptance_status ?? null,
    reception_status: item.reception_status ?? null,
    pre_tax_amount: toNumber(item.pre_tax_amount),
    included_tax_total: toNumber(item.included_tax_total),
    additional_tax_total: toNumber(item.additional_tax_total),
    resellable: Boolean(item.resellable),
    preferred_reimbursement_type_id: item.preferred_reimbursement_type_id ?? null,
    override_reimbursement_type_id: item.override_reimbursement_type_id ?? null,
    effectiveReimbursementTypeId: effectiveTypeId,
    preferredReimbursementType: item.preferredReimbursementType ?? null,
    overrideReimbursementType: item.overrideReimbursementType ?? null,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

function serializeRefundSummary(refund: ReimbursementRefundSummaryRecord) {
  return {
    id: refund.id,
    amount: toNumber(refund.amount),
    state: refund.state ?? null,
    transaction_id: refund.transaction_id ?? null,
    created_at: refund.created_at ?? null,
  };
}

export function serializeReimbursement(reimbursement: ReimbursementRecord) {
  return {
    ...reimbursement,
    total: toNumber(reimbursement.total),
    reimbursementCredits: (reimbursement.reimbursementCredits ?? []).map(
      serializeReimbursementCredit,
    ),
    returnItems: (reimbursement.returnItems ?? []).map(serializeReimbursementItemSummary),
    refunds: (reimbursement.refunds ?? []).map(serializeRefundSummary),
    order: reimbursement.order ?? null,
    customerReturn: reimbursement.customerReturn ?? null,
  };
}

export function serializeReimbursementKind(type: ReimbursementTypeRecord) {
  return {
    ...type,
    active: Boolean(type.active),
    mutable: Boolean(type.mutable),
  };
}

export function serializeReimbursementCredit(credit: ReimbursementCreditRecord) {
  return {
    ...credit,
    amount: toNumber(credit.amount),
  };
}