import { Injectable } from '@nestjs/common';
import { ShipmentService, CreateShipmentInput, UpdateShipmentInput } from '../application/shipment.service';
import { ShipmentStateService } from '../application/shipment-state.service';
import { TrackingService } from '../application/tracking.service';
import { ShippingMethodService, CreateShippingMethodInput, UpdateShippingMethodInput } from '../application/shipping-method.service';
import { ShippingRateService, CreateShippingRateInput, UpdateShippingRateInput } from '../application/shipping-rate.service';
import { ShippingCategoryService, CreateShippingCategoryInput, UpdateShippingCategoryInput } from '../application/shipping-category.service';
import {
  CreateReturnAuthorizationInput,
  ReturnAuthorizationService,
  UpdateReturnAuthorizationStateInput,
} from '../application/return-authorization.service';
import {
  CreateReturnAuthorizationReasonInput,
  ReturnReasonService,
  UpdateReturnAuthorizationReasonInput,
} from '../application/return-reason.service';
import {
  AddReturnItemInput,
  EvaluateReturnItemInput,
  ReturnItemService,
} from '../application/return-item.service';
import {
  CreateCustomerReturnInput,
  CustomerReturnService,
} from '../application/customer-return.service';
import {
  CreateReimbursementInput,
  ReimbursementService,
  UpdateReimbursementStatusInput,
  AssociateReturnItemsInput,
  RequestRefundInput,
} from '../application/reimbursement.service';
import {
  CreateReimbursementTypeInput,
  ReimbursementTypeService,
  UpdateReimbursementTypeInput,
} from '../application/reimbursement-type.service';
import {
  CreateReimbursementCreditInput,
  ReimbursementCreditService,
} from '../application/reimbursement-credit.service';
import { ShipmentAdminFilters, ShippingMethodAvailabilityContext } from '../domain/contracts/fulfillment.contracts';
import { ReturnAuthorizationFilters } from '../infrastructure/repositories/return-repository.types';
import { ReimbursementFilters } from '../infrastructure/repositories/reimbursement-repository.types';

@Injectable()
export class FulfillmentFacade {
  constructor(
    private readonly shipmentService: ShipmentService,
    private readonly shipmentStateService: ShipmentStateService,
    private readonly trackingService: TrackingService,
    private readonly shippingMethodService: ShippingMethodService,
    private readonly shippingRateService: ShippingRateService,
    private readonly shippingCategoryService: ShippingCategoryService,
    private readonly returnAuthorizationService: ReturnAuthorizationService,
    private readonly returnReasonService: ReturnReasonService,
    private readonly returnItemService: ReturnItemService,
    private readonly customerReturnService: CustomerReturnService,
    private readonly reimbursementService: ReimbursementService,
    private readonly reimbursementTypeService: ReimbursementTypeService,
    private readonly reimbursementCreditService: ReimbursementCreditService,
  ) {}

  createShipment(input: CreateShipmentInput) {
    return this.shipmentService.createShipment(input);
  }

  getShipmentById(shipmentId: string) {
    return this.shipmentService.getShipmentById(shipmentId);
  }

  listShipmentsByOrder(orderId: string) {
    return this.shipmentService.listShipmentsByOrder(orderId);
  }

  listAdministrativeShipments(filters: ShipmentAdminFilters) {
    return this.shipmentService.listAdministrativeShipments(filters);
  }

  updateShipment(input: UpdateShipmentInput) {
    return this.shipmentService.updateShipment(input);
  }

  getProjectedOrderShipmentState(orderId: string) {
    return this.shipmentService.getProjectedOrderShipmentState(orderId);
  }

  markShipmentPending(shipmentId: string) {
    return this.shipmentStateService.markPending(shipmentId);
  }

  markShipmentReady(shipmentId: string) {
    return this.shipmentStateService.markReady(shipmentId);
  }

  markShipmentShipped(shipmentId: string, shippedAt?: Date) {
    return this.shipmentStateService.markShipped(shipmentId, shippedAt);
  }

  markShipmentDelivered(shipmentId: string, deliveredAt?: Date) {
    return this.shipmentStateService.markDelivered(shipmentId, deliveredAt);
  }

  addOrUpdateTracking(shipmentId: string, tracking: string) {
    return this.trackingService.addOrUpdateTracking(shipmentId, tracking);
  }

  getTrackingByShipment(shipmentId: string) {
    return this.trackingService.getTrackingByShipment(shipmentId);
  }

  createShippingMethod(input: CreateShippingMethodInput) {
    return this.shippingMethodService.createShippingMethod(input);
  }

  getShippingMethodById(methodId: string) {
    return this.shippingMethodService.getShippingMethodById(methodId);
  }

  listShippingMethods(includeInactive = false, storeId?: string) {
    return this.shippingMethodService.listShippingMethods(includeInactive, storeId);
  }

  updateShippingMethod(input: UpdateShippingMethodInput) {
    return this.shippingMethodService.updateShippingMethod(input);
  }

  activateShippingMethod(methodId: string) {
    return this.shippingMethodService.activateShippingMethod(methodId);
  }

  deactivateShippingMethod(methodId: string) {
    return this.shippingMethodService.deactivateShippingMethod(methodId);
  }

  listAvailableShippingMethods(context: ShippingMethodAvailabilityContext) {
    return this.shippingMethodService.listAvailableMethods(context);
  }

  createShippingRate(input: CreateShippingRateInput) {
    return this.shippingRateService.createShippingRate(input);
  }

  updateShippingRate(input: UpdateShippingRateInput) {
    return this.shippingRateService.updateShippingRate(input);
  }

  listRatesByShipment(shipmentId: string) {
    return this.shippingRateService.listRatesByShipment(shipmentId);
  }

  selectShippingRate(rateId: string) {
    return this.shippingRateService.selectShippingRate(rateId);
  }

  createShippingCategory(input: CreateShippingCategoryInput) {
    return this.shippingCategoryService.createShippingCategory(input);
  }

  getShippingCategoryById(categoryId: string) {
    return this.shippingCategoryService.getShippingCategoryById(categoryId);
  }

  listShippingCategories(storeId?: string) {
    return this.shippingCategoryService.listShippingCategories(storeId);
  }

  updateShippingCategory(input: UpdateShippingCategoryInput) {
    return this.shippingCategoryService.updateShippingCategory(input);
  }

  associateMethodToCategory(methodId: string, categoryId: string) {
    return this.shippingCategoryService.associateMethodToCategory(methodId, categoryId);
  }

  disassociateMethodFromCategory(methodId: string, categoryId: string) {
    return this.shippingCategoryService.disassociateMethodFromCategory(methodId, categoryId);
  }

  listCategoriesForMethod(methodId: string) {
    return this.shippingCategoryService.listCategoriesForMethod(methodId);
  }

  listMethodsForCategory(categoryId: string) {
    return this.shippingCategoryService.listMethodsForCategory(categoryId);
  }

  isMethodApplicable(methodId: string, categoryId: string) {
    return this.shippingCategoryService.isMethodApplicable(methodId, categoryId);
  }

  createReturnAuthorization(input: CreateReturnAuthorizationInput) {
    return this.returnAuthorizationService.createReturnAuthorization(input);
  }

  getReturnAuthorizationById(returnAuthorizationId: string) {
    return this.returnAuthorizationService.getReturnAuthorizationById(returnAuthorizationId);
  }

  listReturnAuthorizations(filters: ReturnAuthorizationFilters) {
    return this.returnAuthorizationService.listReturnAuthorizations(filters);
  }

  authorizeReturnAuthorization(input: UpdateReturnAuthorizationStateInput) {
    return this.returnAuthorizationService.authorizeReturnAuthorization(input);
  }

  approveReturnAuthorization(input: UpdateReturnAuthorizationStateInput) {
    return this.returnAuthorizationService.approveReturnAuthorization(input);
  }

  rejectReturnAuthorization(input: UpdateReturnAuthorizationStateInput) {
    return this.returnAuthorizationService.rejectReturnAuthorization(input);
  }

  cancelReturnAuthorization(input: UpdateReturnAuthorizationStateInput) {
    return this.returnAuthorizationService.cancelReturnAuthorization(input);
  }

  createReturnAuthorizationReason(input: CreateReturnAuthorizationReasonInput) {
    return this.returnReasonService.createReason(input);
  }

  updateReturnAuthorizationReason(input: UpdateReturnAuthorizationReasonInput) {
    return this.returnReasonService.updateReason(input);
  }

  listReturnAuthorizationReasons(activeOnly = true) {
    return this.returnReasonService.listReasons(activeOnly);
  }

  addReturnItem(input: AddReturnItemInput) {
    return this.returnItemService.addReturnItem(input);
  }

  getReturnItemById(returnItemId: string) {
    return this.returnItemService.getReturnItemById(returnItemId);
  }

  listReturnItemsByAuthorization(returnAuthorizationId: string) {
    return this.returnItemService.listReturnItemsByAuthorization(returnAuthorizationId);
  }

  evaluateReturnItem(input: EvaluateReturnItemInput) {
    return this.returnItemService.evaluateReturnItem(input);
  }

  createCustomerReturn(input: CreateCustomerReturnInput) {
    return this.customerReturnService.createCustomerReturn(input);
  }

  getCustomerReturnById(customerReturnId: string) {
    return this.customerReturnService.getCustomerReturnById(customerReturnId);
  }

  // ─── reembolsos ───────────────────────────────────────────────────────────

  createReimbursement(input: CreateReimbursementInput) {
    return this.reimbursementService.createReimbursement(input);
  }

  getReimbursementById(reimbursementId: string) {
    return this.reimbursementService.getReimbursementById(reimbursementId);
  }

  listReimbursementsByOrder(orderId: string) {
    return this.reimbursementService.listReimbursementsByOrder(orderId);
  }

  listReimbursementsByCustomerReturn(customerReturnId: string) {
    return this.reimbursementService.listReimbursementsByCustomerReturn(customerReturnId);
  }

  listReimbursements(filters: ReimbursementFilters) {
    return this.reimbursementService.listReimbursements(filters);
  }

  updateReimbursementStatus(input: UpdateReimbursementStatusInput) {
    return this.reimbursementService.updateReimbursementStatus(input);
  }

  associateReturnItemsToReimbursement(input: AssociateReturnItemsInput) {
    return this.reimbursementService.associateReturnItems(input);
  }

  requestRefundForReimbursement(input: RequestRefundInput) {
    return this.reimbursementService.requestRefundForReimbursement(input);
  }

  // ─── tipos de reembolso ────────────────────────────────────────────────────

  createReimbursementType(input: CreateReimbursementTypeInput) {
    return this.reimbursementTypeService.createReimbursementType(input);
  }

  getReimbursementTypeById(reimbursementTypeId: string) {
    return this.reimbursementTypeService.getReimbursementTypeById(reimbursementTypeId);
  }

  listReimbursementTypes(activeOnly = false) {
    return this.reimbursementTypeService.listReimbursementTypes(activeOnly);
  }

  updateReimbursementType(input: UpdateReimbursementTypeInput) {
    return this.reimbursementTypeService.updateReimbursementType(input);
  }

  activateReimbursementType(reimbursementTypeId: string) {
    return this.reimbursementTypeService.activateReimbursementType(reimbursementTypeId);
  }

  deactivateReimbursementType(reimbursementTypeId: string) {
    return this.reimbursementTypeService.deactivateReimbursementType(reimbursementTypeId);
  }

  // ─── créditos de reembolso ────────────────────────────────────────────────

  createReimbursementCredit(input: CreateReimbursementCreditInput) {
    return this.reimbursementCreditService.createReimbursementCredit(input);
  }

  listCreditsByReimbursement(reimbursementId: string) {
    return this.reimbursementCreditService.listCreditsByReimbursement(reimbursementId);
  }
}