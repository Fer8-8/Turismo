jest.mock('#prisma/client', () => ({}), { virtual: true });

import { FulfillmentResolver } from './fulfillment.resolver';

describe('FulfillmentResolver', () => {
  let resolver: FulfillmentResolver;
  let fulfillmentFacade: Record<string, jest.Mock>;

  beforeEach(() => {
    fulfillmentFacade = {
      markShipmentShipped: jest.fn(),
      listReimbursements: jest.fn(),
    };

    resolver = new FulfillmentResolver(fulfillmentFacade as any);
  });

  it('converts occurredAt into a Date when marking shipments as shipped', async () => {
    fulfillmentFacade.markShipmentShipped.mockResolvedValue({ id: 'sh-1', state: 'shipped' });

    await resolver.markShipmentShipped({
      shipmentId: 'sh-1',
      occurredAt: '2026-04-06T10:30:00.000Z',
    } as any);

    expect(fulfillmentFacade.markShipmentShipped).toHaveBeenCalledWith(
      'sh-1',
      new Date('2026-04-06T10:30:00.000Z'),
    );
  });

  it('maps administrative reimbursement filters without adding resolver business logic', async () => {
    fulfillmentFacade.listReimbursements.mockResolvedValue([]);

    await resolver.getAdministrativeReimbursements({
      orderId: 'ord-1',
      customerReturnId: 'cr-1',
      status: 'pending',
      take: 10,
      skip: 5,
    } as any);

    expect(fulfillmentFacade.listReimbursements).toHaveBeenCalledWith({
      orderId: 'ord-1',
      customerReturnId: 'cr-1',
      status: 'pending',
      take: 10,
      skip: 5,
    });
  });
});