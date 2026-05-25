import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { VariantService } from './variant.service';
import { PriceService } from './price.service';
import { Product } from './entities/product.entity';
import { Variant } from './entities/variant.entity';
import { Price } from './entities/price.entity';
import { ProductConnection } from './entities/product-connection.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { FilterProductsInput } from './dto/filter-products.input';
import { CreateVariantInput } from './dto/create-variant.input';
import { UpdateVariantInput } from './dto/update-variant.input';
import { CreatePriceInput } from './dto/create-price.input';
import { UpdatePriceInput } from './dto/update-price.input';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly variantService: VariantService,
    private readonly priceService: PriceService,
  ) {}

  // ─── PRODUCTOS ───────────────────────────────────────────

  // crear producto con información comercial base
  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.productService.create(createProductInput);
  }

  // listar productos con paginación, búsqueda y filtros
  @Query(() => ProductConnection, { name: 'products' })
  @AllowAnonymous()
  findAll(
    @Args('filterProductsInput', { nullable: true })
    filterProductsInput?: FilterProductsInput,
  ) {
    return this.productService.findAll(filterProductsInput || {});
  }

  // obtener producto por id con variantes y precios
  @Query(() => Product, { name: 'product' })
  @AllowAnonymous()
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  // obtener producto por slug con detalle completo
  @Query(() => Product, { name: 'productBySlug' })
  @AllowAnonymous()
  findBySlug(@Args('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  // actualizar producto con datos parciales
  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }

  // eliminar producto con soft delete
  @Mutation(() => Boolean)
  removeProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productService.remove(id);
  }

  // verificar disponibilidad comercial del producto
  @Query(() => Boolean, { name: 'isProductAvailable' })
  @AllowAnonymous()
  isProductAvailable(@Args('id', { type: () => ID }) id: string) {
    return this.productService.isProductAvailable(id);
  }

  // listar productos habilitados en una tienda
  @Query(() => [Product], { name: 'productsByStore' })
  @AllowAnonymous()
  findProductsByStore(
    @Args('storeId', { type: () => ID }) storeId: string,
  ) {
    return this.productService.getProductsByStore(storeId);
  }

  // asociar producto a tienda
  @Mutation(() => Boolean)
  addProductToStore(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('storeId', { type: () => ID }) storeId: string,
  ) {
    return this.productService
      .addProductToStore(productId, storeId)
      .then(() => true);
  }

  // desasociar producto de tienda
  @Mutation(() => Boolean)
  removeProductFromStore(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('storeId', { type: () => ID }) storeId: string,
  ) {
    return this.productService.removeProductFromStore(productId, storeId);
  }

  // ─── VARIANTES ───────────────────────────────────────────

  // crear variante asociada a producto
  @Mutation(() => Variant)
  createVariant(
    @Args('createVariantInput') createVariantInput: CreateVariantInput,
  ) {
    return this.variantService.create(createVariantInput);
  }

  // obtener variante por id con precios
  @Query(() => Variant, { name: 'variant' })
  @AllowAnonymous()
  findVariant(@Args('id', { type: () => ID }) id: string) {
    return this.variantService.findById(id);
  }

  // listar variantes activas de un producto
  @Query(() => [Variant], { name: 'variantsByProduct' })
  @AllowAnonymous()
  findVariantsByProduct(
    @Args('productId', { type: () => ID }) productId: string,
  ) {
    return this.variantService.findByProductId(productId);
  }

  // buscar variante por SKU
  @Query(() => Variant, { name: 'variantBySku' })
  @AllowAnonymous()
  findVariantBySku(@Args('sku') sku: string) {
    return this.variantService.findBySku(sku);
  }

  // actualizar variante con validación de SKU único
  @Mutation(() => Variant)
  updateVariant(
    @Args('updateVariantInput') updateVariantInput: UpdateVariantInput,
  ) {
    return this.variantService.update(updateVariantInput.id, updateVariantInput);
  }

  // eliminar variante con soft delete
  @Mutation(() => Boolean)
  removeVariant(@Args('id', { type: () => ID }) id: string) {
    return this.variantService.remove(id);
  }

  // verificar disponibilidad comercial de variante
  @Query(() => Boolean, { name: 'isVariantAvailable' })
  @AllowAnonymous()
  isVariantAvailable(@Args('id', { type: () => ID }) id: string) {
    return this.variantService.isVariantAvailable(id);
  }

  // ─── PRECIOS ─────────────────────────────────────────────

  // crear precio asociado a variante
  @Mutation(() => Price)
  createPrice(
    @Args('createPriceInput') createPriceInput: CreatePriceInput,
  ) {
    return this.priceService.create(createPriceInput);
  }

  // listar precios activos de una variante
  @Query(() => [Price], { name: 'pricesByVariant' })
  @AllowAnonymous()
  findPricesByVariant(
    @Args('variantId', { type: () => ID }) variantId: string,
  ) {
    return this.priceService.findByVariantId(variantId);
  }

  // actualizar precio existente
  @Mutation(() => Price)
  updatePrice(
    @Args('updatePriceInput') updatePriceInput: UpdatePriceInput,
  ) {
    return this.priceService.update(updatePriceInput.id, updatePriceInput);
  }

  // eliminar precio con soft delete
  @Mutation(() => Boolean)
  removePrice(@Args('id', { type: () => ID }) id: string) {
    return this.priceService.remove(id);
  }
}
