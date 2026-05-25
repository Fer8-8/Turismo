import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SalesFacade } from '../../facades/sales.facade';
import {
  OrderType,
  OrderHistoryType,
  LineItemType,
  OrderPaymentContextType,
  OrderFulfillmentContextType,
  OrderCommercialContextType,
} from './types';
import {
  CreateOrderInput,
  AddLineItemInput,
  UpdateLineItemInput,
  RemoveLineItemInput,
  AssignOrderAddressInput,
  CancelOrderInput,
  OrderHistoryInput,
  OrderScopeInput,
  OwnedOrderInput,
} from './dto';

@Resolver()
export class SalesResolver {
  constructor(private readonly salesFacade: SalesFacade) {}

  // ─── consultas ─────────────────────────────────────────────

  @Query(() => OrderType, { name: 'order' })
  getOrder(@Args('id', { type: () => ID }) id: string) {
    return this.salesFacade.getOrder(id);
  }

  @Query(() => OrderType, { nullable: true, name: 'orderByNumber' })
  getOrderByNumber(@Args('number') number: string) {
    return this.salesFacade.getOrderByNumber(number);
  }

  @Query(() => OrderHistoryType, { name: 'orderHistory' })
  getOrderHistory(@Args('input') input: OrderHistoryInput) {
    return this.salesFacade.getOrderHistory(input);
  }

  @Query(() => OrderType, { name: 'ownedOrder' })
  getOwnedOrder(@Args('input') input: OwnedOrderInput) {
    return this.salesFacade.getOwnedOrder(
      input.orderId,
      input.userId,
      input.storeId,
    );
  }

  @Query(() => [LineItemType], { name: 'orderLineItems' })
  getOrderLineItems(@Args('orderId', { type: () => ID }) orderId: string) {
    return this.salesFacade.getLineItems(orderId);
  }

  @Query(() => OrderPaymentContextType, { name: 'orderPaymentContext' })
  getOrderPaymentContext(@Args('input') input: OrderScopeInput) {
    return this.salesFacade.getPaymentContext(input.orderId);
  }

  @Query(() => OrderFulfillmentContextType, { name: 'orderFulfillmentContext' })
  getOrderFulfillmentContext(@Args('input') input: OrderScopeInput) {
    return this.salesFacade.getFulfillmentContext(input.orderId);
  }

  @Query(() => OrderCommercialContextType, { name: 'orderCommercialContext' })
  getOrderCommercialContext(@Args('input') input: OrderScopeInput) {
    return this.salesFacade.getCommercialContext(input.orderId);
  }

  // ─── mutaciones ───────────────────────────────────────────

  @Mutation(() => OrderType, { name: 'createOrder' })
  createOrder(@Args('input') input: CreateOrderInput) {
    return this.salesFacade.createOrder({
      userId: input.userId,
      storeId: input.storeId,
      currency: input.currency,
      channel: input.channel,
      lineItems: input.lineItems.map((li) => ({
        variantId: li.variantId,
        quantity: li.quantity,
      })),
    });
  }

  @Mutation(() => LineItemType, { name: 'addLineItem' })
  addLineItem(@Args('input') input: AddLineItemInput) {
    return this.salesFacade.addLineItem({
      orderId: input.orderId,
      variantId: input.variantId,
      quantity: input.quantity,
    });
  }

  @Mutation(() => LineItemType, { name: 'updateLineItemQuantity' })
  updateLineItemQuantity(@Args('input') input: UpdateLineItemInput) {
    return this.salesFacade.updateLineItemQuantity({
      lineItemId: input.lineItemId,
      orderId: input.orderId,
      quantity: input.quantity,
    });
  }

  @Mutation(() => Boolean, { name: 'removeLineItem' })
  async removeLineItem(@Args('input') input: RemoveLineItemInput) {
    await this.salesFacade.removeLineItem(input.orderId, input.lineItemId);
    return true;
  }

  @Mutation(() => OrderType, { name: 'assignOrderAddress' })
  assignOrderAddress(@Args('input') input: AssignOrderAddressInput) {
    return this.salesFacade.assignAddresses({
      orderId: input.orderId,
      shipAddressId: input.shipAddressId,
      billAddressId: input.billAddressId,
    });
  }

  @Mutation(() => OrderType, { name: 'cancelOrder' })
  cancelOrder(@Args('input') input: CancelOrderInput) {
    return this.salesFacade.cancelOrder(input.orderId, input.reason);
  }

  @Mutation(() => OrderType, { name: 'markOrderPending' })
  markOrderPending(@Args('input') input: OrderScopeInput) {
    return this.salesFacade.markOrderPending(input.orderId);
  }

  @Mutation(() => OrderType, { name: 'approveOrder' })
  approveOrder(@Args('input') input: OrderScopeInput) {
    return this.salesFacade.approveOrder(input.orderId);
  }

  @Mutation(() => OrderType, { name: 'recalculateOrderTotals' })
  async recalculateOrderTotals(
    @Args('orderId', { type: () => ID }) orderId: string,
  ) {
    return this.salesFacade.recalculateOrderTotals(orderId);
  }
}
