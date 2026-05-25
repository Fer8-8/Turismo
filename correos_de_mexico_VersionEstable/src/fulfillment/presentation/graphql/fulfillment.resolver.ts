import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FulfillmentFacade } from '../../facades/fulfillment.facade';
import {
  ShipmentType,
  ShipmentTrackingType,
  ShippingMethodType,
  ShippingRateType,
  ShippingCategoryType,
  ReturnAuthorizationType,
  ReturnAuthorizationReasonType,
  ReturnItemType,
  CustomerReturnType,
  ReimbursementType,
  ReimbursementKindType,
  ReimbursementCreditType,
} from './types';
import {
  CreateShipmentInput,
  UpdateShipmentInput,
  ShipmentFiltersInput,
  UpdateShipmentStateInput,
  SetShipmentTrackingInput,
  CreateShippingMethodInput,
  UpdateShippingMethodInput,
  AvailableShippingMethodsInput,
  CreateShippingRateInput,
  UpdateShippingRateInput,
  SelectShippingRateInput,
  CreateShippingCategoryInput,
  UpdateShippingCategoryInput,
  AssociateShippingMethodCategoryInput,
  CreateReturnAuthorizationInput,
  ReturnAuthorizationFiltersInput,
  UpdateReturnAuthorizationStateInput,
  CreateReturnAuthorizationReasonInput,
  UpdateReturnAuthorizationReasonInput,
  AddReturnItemInput,
  EvaluateReturnItemInput,
  CreateCustomerReturnInput,
  CreateReimbursementInput,
  UpdateReimbursementStatusInput,
  CreateReimbursementTypeInput,
  CreateReimbursementCreditInput,
  ReimbursementFiltersInput,
  AssociateReturnItemsReimbursementInput,
  RequestRefundForReimbursementInput,
} from './dto';

@Resolver()
export class FulfillmentResolver {
  constructor(private readonly fulfillmentFacade: FulfillmentFacade) {}

  @Query(() => ShipmentType, { name: 'shipment' })
  getShipment(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.getShipmentById(id);
  }

  @Query(() => [ShipmentType], { name: 'shipmentsByOrder' })
  getShipmentsByOrder(@Args('orderId', { type: () => ID }) orderId: string) {
    return this.fulfillmentFacade.listShipmentsByOrder(orderId);
  }

  @Query(() => [ShipmentType], { name: 'administrativeShipments' })
  getAdministrativeShipments(@Args('input', { nullable: true }) input?: ShipmentFiltersInput) {
    return this.fulfillmentFacade.listAdministrativeShipments({
      orderId: input?.orderId,
      state: input?.state,
      tracking: input?.tracking,
      take: input?.take,
      skip: input?.skip,
    });
  }

  @Query(() => ShipmentTrackingType, { name: 'shipmentTracking' })
  getShipmentTracking(@Args('shipmentId', { type: () => ID }) shipmentId: string) {
    return this.fulfillmentFacade.getTrackingByShipment(shipmentId);
  }

  @Query(() => ShippingMethodType, { name: 'shippingMethod' })
  getShippingMethod(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.getShippingMethodById(id);
  }

  @Query(() => [ShippingMethodType], { name: 'shippingMethods' })
  getShippingMethods(
    @Args('includeInactive', { nullable: true, defaultValue: false }) includeInactive: boolean,
    @Args('storeId', { type: () => ID, nullable: true }) storeId?: string,
  ) {
    return this.fulfillmentFacade.listShippingMethods(includeInactive, storeId);
  }

  @Query(() => [ShippingMethodType], { name: 'availableShippingMethods' })
  getAvailableShippingMethods(@Args('input') input: AvailableShippingMethodsInput) {
    return this.fulfillmentFacade.listAvailableShippingMethods(input);
  }

  @Query(() => [ShippingRateType], { name: 'shippingRatesByShipment' })
  getShippingRatesByShipment(@Args('shipmentId', { type: () => ID }) shipmentId: string) {
    return this.fulfillmentFacade.listRatesByShipment(shipmentId);
  }

  @Query(() => ShippingCategoryType, { name: 'shippingCategory' })
  getShippingCategory(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.getShippingCategoryById(id);
  }

  @Query(() => [ShippingCategoryType], { name: 'shippingCategories' })
  getShippingCategories(@Args('storeId', { type: () => ID, nullable: true }) storeId?: string) {
    return this.fulfillmentFacade.listShippingCategories(storeId);
  }

  @Query(() => [ShippingCategoryType], { name: 'shippingCategoriesForMethod' })
  getShippingCategoriesForMethod(@Args('methodId', { type: () => ID }) methodId: string) {
    return this.fulfillmentFacade.listCategoriesForMethod(methodId);
  }

  @Query(() => [ShippingMethodType], { name: 'shippingMethodsForCategory' })
  getShippingMethodsForCategory(@Args('categoryId', { type: () => ID }) categoryId: string) {
    return this.fulfillmentFacade.listMethodsForCategory(categoryId);
  }

  @Query(() => ReturnAuthorizationType, { name: 'returnAuthorization' })
  getReturnAuthorization(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.getReturnAuthorizationById(id);
  }

  @Query(() => [ReturnAuthorizationType], { name: 'administrativeReturnAuthorizations' })
  getAdministrativeReturnAuthorizations(
    @Args('input', { nullable: true }) input?: ReturnAuthorizationFiltersInput,
  ) {
    return this.fulfillmentFacade.listReturnAuthorizations({
      orderId: input?.orderId,
      state: input?.state,
      reasonId: input?.reasonId,
      take: input?.take,
      skip: input?.skip,
    });
  }

  @Query(() => [ReturnAuthorizationReasonType], { name: 'returnAuthorizationReasons' })
  getReturnAuthorizationReasons(
    @Args('activeOnly', { nullable: true, defaultValue: true }) activeOnly: boolean,
  ) {
    return this.fulfillmentFacade.listReturnAuthorizationReasons(activeOnly);
  }

  @Query(() => ReturnItemType, { name: 'returnItem' })
  getReturnItem(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.getReturnItemById(id);
  }

  @Query(() => [ReturnItemType], { name: 'returnItemsByAuthorization' })
  getReturnItemsByAuthorization(
    @Args('returnAuthorizationId', { type: () => ID }) returnAuthorizationId: string,
  ) {
    return this.fulfillmentFacade.listReturnItemsByAuthorization(returnAuthorizationId);
  }

  @Query(() => CustomerReturnType, { name: 'customerReturn' })
  getCustomerReturn(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.getCustomerReturnById(id);
  }

  @Query(() => Boolean, { name: 'isShippingMethodApplicable' })
  isShippingMethodApplicable(
    @Args('methodId', { type: () => ID }) methodId: string,
    @Args('categoryId', { type: () => ID }) categoryId: string,
  ) {
    return this.fulfillmentFacade.isMethodApplicable(methodId, categoryId);
  }

  @Mutation(() => ShipmentType, { name: 'createShipment' })
  createShipment(@Args('input') input: CreateShipmentInput) {
    return this.fulfillmentFacade.createShipment(input);
  }

  @Mutation(() => ShipmentType, { name: 'updateShipment' })
  updateShipment(@Args('input') input: UpdateShipmentInput) {
    return this.fulfillmentFacade.updateShipment(input);
  }

  @Mutation(() => ShipmentType, { name: 'markShipmentPending' })
  markShipmentPending(@Args('input') input: UpdateShipmentStateInput) {
    return this.fulfillmentFacade.markShipmentPending(input.shipmentId);
  }

  @Mutation(() => ShipmentType, { name: 'markShipmentReady' })
  markShipmentReady(@Args('input') input: UpdateShipmentStateInput) {
    return this.fulfillmentFacade.markShipmentReady(input.shipmentId);
  }

  @Mutation(() => ShipmentType, { name: 'markShipmentShipped' })
  markShipmentShipped(@Args('input') input: UpdateShipmentStateInput) {
    return this.fulfillmentFacade.markShipmentShipped(
      input.shipmentId,
      input.occurredAt ? new Date(input.occurredAt) : undefined,
    );
  }

  @Mutation(() => ShipmentType, { name: 'markShipmentDelivered' })
  markShipmentDelivered(@Args('input') input: UpdateShipmentStateInput) {
    return this.fulfillmentFacade.markShipmentDelivered(
      input.shipmentId,
      input.occurredAt ? new Date(input.occurredAt) : undefined,
    );
  }

  @Mutation(() => ShipmentTrackingType, { name: 'setShipmentTracking' })
  setShipmentTracking(@Args('input') input: SetShipmentTrackingInput) {
    return this.fulfillmentFacade.addOrUpdateTracking(input.shipmentId, input.tracking);
  }

  @Mutation(() => ShippingMethodType, { name: 'createShippingMethod' })
  createShippingMethod(@Args('input') input: CreateShippingMethodInput) {
    return this.fulfillmentFacade.createShippingMethod(input);
  }

  @Mutation(() => ShippingMethodType, { name: 'updateShippingMethod' })
  updateShippingMethod(@Args('input') input: UpdateShippingMethodInput) {
    return this.fulfillmentFacade.updateShippingMethod(input);
  }

  @Mutation(() => ShippingMethodType, { name: 'activateShippingMethod' })
  activateShippingMethod(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.activateShippingMethod(id);
  }

  @Mutation(() => ShippingMethodType, { name: 'deactivateShippingMethod' })
  deactivateShippingMethod(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.deactivateShippingMethod(id);
  }

  @Mutation(() => ShippingRateType, { name: 'createShippingRate' })
  createShippingRate(@Args('input') input: CreateShippingRateInput) {
    return this.fulfillmentFacade.createShippingRate(input);
  }

  @Mutation(() => ShippingRateType, { name: 'updateShippingRate' })
  updateShippingRate(@Args('input') input: UpdateShippingRateInput) {
    return this.fulfillmentFacade.updateShippingRate(input);
  }

  @Mutation(() => ShipmentType, { name: 'selectShippingRate' })
  selectShippingRate(@Args('input') input: SelectShippingRateInput) {
    return this.fulfillmentFacade.selectShippingRate(input.rateId);
  }

  @Mutation(() => ShippingCategoryType, { name: 'createShippingCategory' })
  createShippingCategory(@Args('input') input: CreateShippingCategoryInput) {
    return this.fulfillmentFacade.createShippingCategory(input);
  }

  @Mutation(() => ShippingCategoryType, { name: 'updateShippingCategory' })
  updateShippingCategory(@Args('input') input: UpdateShippingCategoryInput) {
    return this.fulfillmentFacade.updateShippingCategory(input);
  }

  @Mutation(() => Boolean, { name: 'associateShippingMethodToCategory' })
  associateShippingMethodToCategory(@Args('input') input: AssociateShippingMethodCategoryInput) {
    return this.fulfillmentFacade.associateMethodToCategory(input.methodId, input.categoryId);
  }

  @Mutation(() => Boolean, { name: 'disassociateShippingMethodFromCategory' })
  disassociateShippingMethodFromCategory(
    @Args('input') input: AssociateShippingMethodCategoryInput,
  ) {
    return this.fulfillmentFacade.disassociateMethodFromCategory(input.methodId, input.categoryId);
  }

  @Mutation(() => ReturnAuthorizationType, { name: 'createReturnAuthorization' })
  createReturnAuthorization(@Args('input') input: CreateReturnAuthorizationInput) {
    return this.fulfillmentFacade.createReturnAuthorization(input);
  }

  @Mutation(() => ReturnAuthorizationType, { name: 'authorizeReturnAuthorization' })
  authorizeReturnAuthorization(@Args('input') input: UpdateReturnAuthorizationStateInput) {
    return this.fulfillmentFacade.authorizeReturnAuthorization(input);
  }

  @Mutation(() => ReturnAuthorizationType, { name: 'approveReturnAuthorization' })
  approveReturnAuthorization(@Args('input') input: UpdateReturnAuthorizationStateInput) {
    return this.fulfillmentFacade.approveReturnAuthorization(input);
  }

  @Mutation(() => ReturnAuthorizationType, { name: 'rejectReturnAuthorization' })
  rejectReturnAuthorization(@Args('input') input: UpdateReturnAuthorizationStateInput) {
    return this.fulfillmentFacade.rejectReturnAuthorization(input);
  }

  @Mutation(() => ReturnAuthorizationType, { name: 'cancelReturnAuthorization' })
  cancelReturnAuthorization(@Args('input') input: UpdateReturnAuthorizationStateInput) {
    return this.fulfillmentFacade.cancelReturnAuthorization(input);
  }

  @Mutation(() => ReturnAuthorizationReasonType, { name: 'createReturnAuthorizationReason' })
  createReturnAuthorizationReason(@Args('input') input: CreateReturnAuthorizationReasonInput) {
    return this.fulfillmentFacade.createReturnAuthorizationReason(input);
  }

  @Mutation(() => ReturnAuthorizationReasonType, { name: 'updateReturnAuthorizationReason' })
  updateReturnAuthorizationReason(@Args('input') input: UpdateReturnAuthorizationReasonInput) {
    return this.fulfillmentFacade.updateReturnAuthorizationReason(input);
  }

  @Mutation(() => ReturnItemType, { name: 'addReturnItem' })
  addReturnItem(@Args('input') input: AddReturnItemInput) {
    return this.fulfillmentFacade.addReturnItem(input);
  }

  @Mutation(() => ReturnItemType, { name: 'evaluateReturnItem' })
  evaluateReturnItem(@Args('input') input: EvaluateReturnItemInput) {
    return this.fulfillmentFacade.evaluateReturnItem(input);
  }

  @Mutation(() => CustomerReturnType, { name: 'createCustomerReturn' })
  createCustomerReturn(@Args('input') input: CreateCustomerReturnInput) {
    return this.fulfillmentFacade.createCustomerReturn(input);
  }

  // ─── consultas de reembolso ────────────────────────────────────────────────

  @Query(() => ReimbursementType, { name: 'reimbursement' })
  getReimbursement(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.getReimbursementById(id);
  }

  @Query(() => [ReimbursementType], { name: 'reimbursementsByOrder' })
  getReimbursementsByOrder(@Args('orderId', { type: () => ID }) orderId: string) {
    return this.fulfillmentFacade.listReimbursementsByOrder(orderId);
  }

  @Query(() => [ReimbursementType], { name: 'reimbursementsByCustomerReturn' })
  getReimbursementsByCustomerReturn(
    @Args('customerReturnId', { type: () => ID }) customerReturnId: string,
  ) {
    return this.fulfillmentFacade.listReimbursementsByCustomerReturn(customerReturnId);
  }

  @Query(() => [ReimbursementType], { name: 'administrativeReimbursements' })
  getAdministrativeReimbursements(
    @Args('input', { nullable: true }) input?: ReimbursementFiltersInput,
  ) {
    return this.fulfillmentFacade.listReimbursements({
      orderId: input?.orderId,
      customerReturnId: input?.customerReturnId,
      status: input?.status,
      take: input?.take,
      skip: input?.skip,
    });
  }

  @Query(() => ReimbursementKindType, { name: 'reimbursementType' })
  getReimbursementType(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.getReimbursementTypeById(id);
  }

  @Query(() => [ReimbursementKindType], { name: 'reimbursementTypes' })
  getReimbursementTypes(
    @Args('activeOnly', { nullable: true, defaultValue: false }) activeOnly: boolean,
  ) {
    return this.fulfillmentFacade.listReimbursementTypes(activeOnly);
  }

  @Query(() => [ReimbursementCreditType], { name: 'creditsByReimbursement' })
  getCreditsByReimbursement(
    @Args('reimbursementId', { type: () => ID }) reimbursementId: string,
  ) {
    return this.fulfillmentFacade.listCreditsByReimbursement(reimbursementId);
  }

  // ─── mutaciones de reembolso ──────────────────────────────────────────────

  @Mutation(() => ReimbursementType, { name: 'createReimbursement' })
  createReimbursement(@Args('input') input: CreateReimbursementInput) {
    return this.fulfillmentFacade.createReimbursement({
      orderId: input.orderId,
      customerReturnId: input.customerReturnId,
      total: input.total,
    });
  }

  @Mutation(() => ReimbursementType, { name: 'updateReimbursementStatus' })
  updateReimbursementStatus(@Args('input') input: UpdateReimbursementStatusInput) {
    return this.fulfillmentFacade.updateReimbursementStatus({
      reimbursementId: input.reimbursementId,
      status: input.status,
    });
  }

  @Mutation(() => ReimbursementType, { name: 'associateReturnItemsToReimbursement' })
  associateReturnItemsToReimbursement(
    @Args('input') input: AssociateReturnItemsReimbursementInput,
  ) {
    return this.fulfillmentFacade.associateReturnItemsToReimbursement({
      reimbursementId: input.reimbursementId,
      itemIds: input.itemIds,
    });
  }

  @Mutation(() => ReimbursementType, { name: 'requestRefundForReimbursement' })
  requestRefundForReimbursement(@Args('input') input: RequestRefundForReimbursementInput) {
    return this.fulfillmentFacade.requestRefundForReimbursement({
      reimbursementId: input.reimbursementId,
      refundReasonId: input.refundReasonId,
      amount: input.amount,
    });
  }

  @Mutation(() => ReimbursementKindType, { name: 'createReimbursementType' })
  createReimbursementType(@Args('input') input: CreateReimbursementTypeInput) {
    return this.fulfillmentFacade.createReimbursementType({
      name: input.name,
      active: input.active,
      mutable: input.mutable,
      type: input.type,
    });
  }

  @Mutation(() => ReimbursementKindType, { name: 'activateReimbursementType' })
  activateReimbursementType(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.activateReimbursementType(id);
  }

  @Mutation(() => ReimbursementKindType, { name: 'deactivateReimbursementType' })
  deactivateReimbursementType(@Args('id', { type: () => ID }) id: string) {
    return this.fulfillmentFacade.deactivateReimbursementType(id);
  }

  @Mutation(() => ReimbursementCreditType, { name: 'createReimbursementCredit' })
  createReimbursementCredit(@Args('input') input: CreateReimbursementCreditInput) {
    return this.fulfillmentFacade.createReimbursementCredit({
      reimbursementId: input.reimbursementId,
      amount: input.amount,
      creditableId: input.creditableId,
      creditableType: input.creditableType,
    });
  }
}