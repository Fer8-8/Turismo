import { Injectable } from '@nestjs/common';
import { TaxonomyService } from '../taxonomy.service';
import { TaxonService } from '../taxon.service';
import { PropertyService } from '../property.service';
import { PrototypeService } from '../prototype.service';

// punto de acceso público para otros módulos del sistema
@Injectable()
export class CatalogFacade {
  constructor(
    private taxonomyService: TaxonomyService,
    private taxonService: TaxonService,
    private propertyService: PropertyService,
    private prototypeService: PrototypeService,
  ) {}

  // ─── TAXONOMÍA ──────────────────────────────────────────

  async getTaxonomyById(id: string) {
    return this.taxonomyService.findOne(id);
  }

  async getTaxonomies() {
    return this.taxonomyService.findAll();
  }

  async getTaxonomiesByStore(storeId: string) {
    return this.taxonomyService.findByStore(storeId);
  }

  async validateTaxonomyExists(id: string): Promise<boolean> {
    return this.taxonomyService.validateTaxonomyExists(id);
  }

  // ─── TAXON ──────────────────────────────────────────────

  async getTaxonById(id: string) {
    return this.taxonService.findById(id);
  }

  async getTaxonsByTaxonomy(taxonomyId: string) {
    return this.taxonService.findByTaxonomy(taxonomyId);
  }

  async getTaxonTree(taxonomyId: string) {
    return this.taxonService.getTree(taxonomyId);
  }

  async getVisibleTaxons(taxonomyId: string) {
    return this.taxonService.getVisibleTaxons(taxonomyId);
  }

  async validateTaxonExists(id: string): Promise<boolean> {
    return this.taxonService.validateTaxonExists(id);
  }

  // ─── PRODUCTO ↔ TAXON ──────────────────────────────────

  async getProductsByTaxon(taxonId: string) {
    return this.taxonService.getProductsByTaxon(taxonId);
  }

  async getTaxonsByProduct(productId: string) {
    return this.taxonService.getTaxonsByProduct(productId);
  }

  async isProductInTaxon(productId: string, taxonId: string): Promise<boolean> {
    return this.taxonService.isProductInTaxon(productId, taxonId);
  }

  // ─── PROPIEDADES ────────────────────────────────────────

  async getPropertiesByProduct(productId: string) {
    return this.propertyService.getPropertiesByProduct(productId);
  }

  async getVisiblePropertiesByProduct(productId: string) {
    return this.propertyService.getVisiblePropertiesByProduct(productId);
  }

  async getFilterableProperties() {
    return this.propertyService.getFilterableProperties();
  }

  async validatePropertyExists(id: string): Promise<boolean> {
    return this.propertyService.validatePropertyExists(id);
  }

  // ─── PROTOTIPO ──────────────────────────────────────────

  async getPrototypeById(id: string) {
    return this.prototypeService.findById(id);
  }

  async getPropertiesByPrototype(prototypeId: string) {
    return this.prototypeService.getPropertiesByPrototype(prototypeId);
  }

  async getOptionTypesByPrototype(prototypeId: string) {
    return this.prototypeService.getOptionTypesByPrototype(prototypeId);
  }
}
