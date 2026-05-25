export interface ShipmentAdminFilters {
  orderId?: string;
  state?: string;
  tracking?: string;
  take?: number;
  skip?: number;
}

export interface ShippingMethodAvailabilityContext {
  orderId?: string;
  storeId?: string;
  shippingCategoryId?: string;
  includeInactive?: boolean;
}

export interface ShipmentTrackingView {
  shipmentId: string;
  tracking: string | null;
  state: string | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
}