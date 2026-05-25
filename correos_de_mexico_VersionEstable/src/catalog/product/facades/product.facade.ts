import { Injectable } from '@nestjs/common';
import { ProductService } from '../product.service';
import { VariantService } from '../variant.service';
import { PriceService } from '../price.service';

// punto de acceso público para otros módulos del sistema
@Injectable()
export class ProductFacade {
  constructor(
    private productService: ProductService,
    private variantService: VariantService,
    private priceService: PriceService,
  ) {}

  // ─── PRODUCTO ────────────────────────────────────────────

  // obtener producto completo por id con variantes y precios
  async getProductById(id: string) {
    return this.productService.findOne(id);
  }

  // obtener producto completo por slug
  async getProductBySlug(slug: string) {
    return this.productService.findBySlug(slug);
  }

  // validar que producto existe y no está eliminado
  async validateProductExists(id: string): Promise<boolean> {
    return this.productService.validateProductExists(id);
  }

  // verificar disponibilidad comercial del producto
  async isProductAvailable(id: string): Promise<boolean> {
    return this.productService.isProductAvailable(id);
  }

  // ─── VARIANTE ────────────────────────────────────────────

  // obtener variante por id con precios
  async getVariantById(id: string) {
    return this.variantService.findById(id);
  }

  // obtener variante por SKU con producto asociado
  async getVariantBySku(sku: string) {
    return this.variantService.findBySku(sku);
  }

  // listar variantes activas de un producto
  async getVariantsByProduct(productId: string) {
    return this.variantService.findByProductId(productId);
  }

  // validar que variante existe y no está eliminada
  async validateVariantExists(id: string): Promise<boolean> {
    return this.variantService.validateVariantExists(id);
  }

  // verificar disponibilidad comercial de variante y producto padre
  async isVariantAvailable(id: string): Promise<boolean> {
    return this.variantService.isVariantAvailable(id);
  }

  // verificar si variante tiene tracking de inventario
  async isVariantTrackable(id: string): Promise<boolean> {
    return this.variantService.isVariantTrackable(id);
  }

  // ─── PARA SALES ──────────────────────────────────────────

  // obtener variante con datos mínimos para line items
  async getVariantForSales(id: string) {
    return this.variantService.getVariantForSales(id);
  }

  // obtener precio base de variante para cálculo de venta
  async getVariantBasePrice(variantId: string) {
    return this.priceService.getBasePrice(variantId);
  }

  // ─── PARA INVENTORY ──────────────────────────────────────

  // obtener variante con dimensiones para fulfillment
  async getVariantForInventory(id: string) {
    return this.variantService.getVariantForInventory(id);
  }

  // resolver product_id a partir de variante
  async resolveProductForVariant(variantId: string): Promise<string> {
    return this.variantService.resolveProductForVariant(variantId);
  }

  // ─── PRECIOS ─────────────────────────────────────────────

  // obtener precio base (más antiguo activo) de variante
  async getBasePrice(variantId: string) {
    return this.priceService.getBasePrice(variantId);
  }

  // listar todos los precios activos de una variante
  async getPricesForVariant(variantId: string) {
    return this.priceService.findByVariantId(variantId);
  }

  // ─── TIENDA ──────────────────────────────────────────────

  // obtener ids de tiendas donde el producto está habilitado
  async getStoresForProduct(productId: string): Promise<string[]> {
    return this.productService.getStoresForProduct(productId);
  }

  // verificar si producto pertenece a una tienda
  async isProductInStore(
    productId: string,
    storeId: string,
  ): Promise<boolean> {
    return this.productService.isProductInStore(productId, storeId);
  }

  // listar productos habilitados en una tienda
  async getProductsByStore(storeId: string) {
    return this.productService.getProductsByStore(storeId);
  }
}
