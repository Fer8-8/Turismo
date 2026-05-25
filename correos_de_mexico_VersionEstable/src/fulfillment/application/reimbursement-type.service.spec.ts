import { Test, TestingModule } from '@nestjs/testing';
import { ReimbursementTypeKind } from '../domain/enums/reimbursement-type-kind.enum';
import { ReimbursementTypeImmutableException } from '../domain/exceptions/fulfillment.exceptions';
import { ReimbursementTypeRepository } from '../infrastructure/repositories/reimbursement-type.repository';
import { ReimbursementTypeService } from './reimbursement-type.service';

describe('ReimbursementTypeService', () => {
  let service: ReimbursementTypeService;
  let reimbursementTypeRepository: Record<string, jest.Mock>;

  beforeEach(async () => {
    reimbursementTypeRepository = {
      create: jest.fn(),
      findByIdOrThrow: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      activate: jest.fn(),
      deactivate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReimbursementTypeService,
        { provide: ReimbursementTypeRepository, useValue: reimbursementTypeRepository },
      ],
    }).compile();

    service = module.get(ReimbursementTypeService);
  });

  it('creates reimbursement types using the domain enum', async () => {
    reimbursementTypeRepository.create.mockResolvedValue({
      id: 'rt-1',
      name: 'Refund',
      active: true,
      mutable: true,
      type: ReimbursementTypeKind.REFUND,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await service.createReimbursementType({
      name: 'Refund',
      type: ReimbursementTypeKind.REFUND,
    });

    expect(reimbursementTypeRepository.create).toHaveBeenCalledWith({
      name: 'Refund',
      active: true,
      mutable: true,
      type: ReimbursementTypeKind.REFUND,
    });
    expect(result.type).toBe(ReimbursementTypeKind.REFUND);
  });

  it('rejects updates when the reimbursement type is immutable', async () => {
    reimbursementTypeRepository.findByIdOrThrow.mockResolvedValue({
      id: 'rt-1',
      mutable: false,
    });

    await expect(
      service.updateReimbursementType({
        reimbursementTypeId: 'rt-1',
        type: ReimbursementTypeKind.ADJUSTMENT,
      }),
    ).rejects.toBeInstanceOf(ReimbursementTypeImmutableException);
  });
});