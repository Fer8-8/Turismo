import { Injectable } from '@nestjs/common';
import { TaxCategoryService } from '../tax-category.service';
import { TaxRateService } from '../tax-rate.service';
import { ZoneService } from '../zone.service';
import {
  TaxCalculationService,
  OrderTaxInput,
} from '../tax-calculation.service';
import { FilterTaxCategoriesInput, FilterTaxRatesInput } from '../dto';

// punto de acceso público para que otros módulos calculen impuestos
@Injectable()
export class TaxFacade {
  constructor(
    private readonly categoryService: TaxCategoryService,
    private readonly rateService: TaxRateService,
    private readonly zoneService: ZoneService,
    private readonly calculationService: TaxCalculationService,
  ) {}

  // ─── TAX CATEGORIES ─────────────────────────────────────

  getCategoryById(id: string) {
    return this.categoryService.findById(id);
  }

  listCategories(filter?: FilterTaxCategoriesInput) {
    return this.categoryService.findAll(filter);
  }

  getDefaultCategory() {
    return this.categoryService.findDefault();
  }

  getCategoryByTaxCode(code: string) {
    return this.categoryService.findByTaxCode(code);
  }

  validateCategoryExists(id: string) {
    return this.categoryService.validateExists(id);
  }

  // ─── tasas de impuesto ──────────────────────────────────────────

  getRateById(id: string) {
    return this.rateService.findById(id);
  }

  listRates(filter?: FilterTaxRatesInput) {
    return this.rateService.findAll(filter);
  }

  getRatesByZone(zoneId: string) {
    return this.rateService.findByZone(zoneId);
  }

  getRatesByCategory(categoryId: string) {
    return this.rateService.findByCategory(categoryId);
  }

  getRatesByCategoryAndZone(categoryId: string, zoneId: string) {
    return this.rateService.findByCategoryAndZone(categoryId, zoneId);
  }

  // ─── ZONES ──────────────────────────────────────────────

  getZoneById(id: string) {
    return this.zoneService.findById(id);
  }

  resolveZoneForState(stateId: string) {
    return this.zoneService.resolveZoneForState(stateId);
  }

  validateZoneExists(id: string) {
    return this.zoneService.validateExists(id);
  }

  // ─── CÁLCULOS ───────────────────────────────────────────

  calculateLineTax(
    amount: number,
    taxCategoryId?: string,
    stateId?: string,
    zoneId?: string,
  ) {
    return this.calculationService.calculateLineTax(
      amount,
      taxCategoryId,
      stateId,
      zoneId,
    );
  }

  calculateShippingTax(
    shippingAmount: number,
    taxCategoryId?: string,
    stateId?: string,
    zoneId?: string,
  ) {
    return this.calculationService.calculateShippingTax(
      shippingAmount,
      taxCategoryId,
      stateId,
      zoneId,
    );
  }

  calculateOrderTax(input: OrderTaxInput) {
    return this.calculationService.calculateOrderTax(input);
  }
}
