import { Test } from '@nestjs/testing';
import { RefundReasonService } from './refund-reason.service';
import { RefundReasonRepository } from '../infrastructure/repositories/refund-reason.repository';
import { RefundReasonDisabledException } from '../domain/exceptions';

const mockRepo = {
  create: jest.fn(),
  findByIdOrThrow: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
};

describe('RefundReasonService', () => {
  let service: RefundReasonService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RefundReasonService,
        { provide: RefundReasonRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get(RefundReasonService);
    jest.resetAllMocks();
  });

  describe('validateActiveReason', () => {
    it('returns the reason when active', async () => {
      const reason = { id: 'rr-1', name: 'Defective', active: true };
      mockRepo.findByIdOrThrow.mockResolvedValue(reason);

      const result = await service.validateActiveReason('rr-1');

      expect(result).toBe(reason);
    });

    it('throws RefundReasonDisabledException when reason is inactive', async () => {
      mockRepo.findByIdOrThrow.mockResolvedValue({ id: 'rr-1', name: 'Old reason', active: false });

      await expect(service.validateActiveReason('rr-1')).rejects.toThrow(RefundReasonDisabledException);
    });
  });

  describe('activateRefundReason', () => {
    it('verifies existence then sets active=true', async () => {
      const reason = { id: 'rr-1', active: false };
      mockRepo.findByIdOrThrow.mockResolvedValue(reason);
      mockRepo.update.mockResolvedValue({ ...reason, active: true });

      await service.activateRefundReason('rr-1');

      expect(mockRepo.findByIdOrThrow).toHaveBeenCalledWith('rr-1');
      expect(mockRepo.update).toHaveBeenCalledWith('rr-1', { active: true });
    });
  });

  describe('deactivateRefundReason', () => {
    it('verifies existence then sets active=false', async () => {
      const reason = { id: 'rr-1', active: true };
      mockRepo.findByIdOrThrow.mockResolvedValue(reason);
      mockRepo.update.mockResolvedValue({ ...reason, active: false });

      await service.deactivateRefundReason('rr-1');

      expect(mockRepo.findByIdOrThrow).toHaveBeenCalledWith('rr-1');
      expect(mockRepo.update).toHaveBeenCalledWith('rr-1', { active: false });
    });
  });

  describe('listRefundReasons', () => {
    it('passes includeInactive=false by default', async () => {
      mockRepo.findAll.mockResolvedValue([]);

      await service.listRefundReasons();

      expect(mockRepo.findAll).toHaveBeenCalledWith(false);
    });

    it('passes includeInactive=true when requested', async () => {
      mockRepo.findAll.mockResolvedValue([]);

      await service.listRefundReasons(true);

      expect(mockRepo.findAll).toHaveBeenCalledWith(true);
    });
  });
});
