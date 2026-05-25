import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InventoryFacade } from '../inventory.facade';

@Resolver()
export class InventoryResolver {
  constructor(private readonly inventoryFacade: InventoryFacade) {}

  // Retrieves real availability (Physical stock minus reservations)
  @Query(() => Int, { name: 'availableStock' })
  async getAvailableStock(
    @Args('variantId', { type: () => String }) variantId: string
  ): Promise<number> {
    return this.inventoryFacade.getAvailableStock(variantId);
  }

  // Allows administrative manual adjustments (Rule 18)
  @Mutation(() => Boolean, { name: 'adjustInventory' })
  async adjustInventory(
    @Args('variantId', { type: () => String }) variantId: string,
    @Args('locationId', { type: () => String }) locationId: string,
    @Args('quantity', { type: () => Int }) quantity: number,
    @Args('reason', { type: () => String }) reason: string,
  ): Promise<boolean> {
    if (quantity > 0) {
      await this.inventoryFacade.incrementInventory(
        variantId, 
        locationId, 
        quantity, 
        reason, 
        'admin_adjustment'
      );
    } else if (quantity < 0) {
      await this.inventoryFacade.decrementInventory(
        variantId, 
        locationId, 
        quantity, 
        reason, 
        'admin_adjustment'
      );
    }
    
    return true;
  }
}