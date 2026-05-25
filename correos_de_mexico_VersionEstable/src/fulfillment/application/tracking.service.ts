import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../infrastructure/repositories/shipment.repository';
import { serializeTrackingView } from './fulfillment.mapper';

@Injectable()
export class TrackingService {
  constructor(private readonly shipmentRepo: ShipmentRepository) {}

  async addOrUpdateTracking(shipmentId: string, tracking: string) {
    const shipment = await this.shipmentRepo.updateTracking(shipmentId, tracking);
    return serializeTrackingView(shipment);
  }

  async getTrackingByShipment(shipmentId: string) {
    const shipment = await this.shipmentRepo.findByIdOrThrow(shipmentId);
    return serializeTrackingView(shipment);
  }
}