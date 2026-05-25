// calcula el subtotal de una línea: precio × cantidad.
// trabaja en centavos enteros para evitar imprecisión de punto flotante;
// la conversión a decimal la hace el repositorio al persistir.
export function calculateLineSubtotal(
  priceAmount: number,
  quantity: number,
): number {
  return parseFloat((priceAmount * quantity).toFixed(2));
}

export interface LineItemTotals {
  price: number;
  quantity: number;
  adjustment_total: number;
  promo_total: number;
  additional_tax_total: number;
  included_tax_total: number;
}

export interface OrderTotals {
  item_total: number;
  adjustment_total: number;
  promo_total: number;
  shipment_total: number;
  additional_tax_total: number;
  included_tax_total: number;
  payment_total: number;
  total: number;
  item_count: number;
}

// consolida los totales de una orden a partir de sus artículos de línea.
// `shipment_total` y `payment_total` se reciben como parámetros porque
// provienen de dominios externos (cumplimiento / pagos); en primera ola siempre son 0.
export function consolidateOrderTotals(
  lineItems: LineItemTotals[],
  shipmentTotal = 0,
  paymentTotal = 0,
): OrderTotals {
  let itemTotal = 0;
  let adjustmentTotal = 0;
  let promoTotal = 0;
  let additionalTaxTotal = 0;
  let includedTaxTotal = 0;
  let itemCount = 0;

  for (const li of lineItems) {
    const lineSubtotal = calculateLineSubtotal(li.price, li.quantity);
    itemTotal = parseFloat((itemTotal + lineSubtotal).toFixed(2));
    adjustmentTotal = parseFloat(
      (adjustmentTotal + li.adjustment_total).toFixed(2),
    );
    promoTotal = parseFloat((promoTotal + li.promo_total).toFixed(2));
    additionalTaxTotal = parseFloat(
      (additionalTaxTotal + li.additional_tax_total).toFixed(2),
    );
    includedTaxTotal = parseFloat(
      (includedTaxTotal + li.included_tax_total).toFixed(2),
    );
    itemCount += li.quantity;
  }

  const total = parseFloat(
    (
      itemTotal +
      adjustmentTotal +
      promoTotal +
      shipmentTotal +
      additionalTaxTotal
    ).toFixed(2),
  );

  return {
    item_total: itemTotal,
    adjustment_total: adjustmentTotal,
    promo_total: promoTotal,
    shipment_total: shipmentTotal,
    additional_tax_total: additionalTaxTotal,
    included_tax_total: includedTaxTotal,
    payment_total: paymentTotal,
    total,
    item_count: itemCount,
  };
}
