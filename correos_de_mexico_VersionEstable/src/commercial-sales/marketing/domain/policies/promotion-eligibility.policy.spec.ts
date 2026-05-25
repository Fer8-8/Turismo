import {
  isPromotionWithinWindow,
  isPromotionWithinUsageLimit,
  isPromotionEligible,
} from './promotion-eligibility.policy';

const past = new Date('2020-01-01T00:00:00Z');
const future = new Date('2099-12-31T00:00:00Z');
const now = new Date('2026-04-07T12:00:00Z');

describe('isPromotionWithinWindow', () => {
  it('returns true when active and no date window set', () => {
    expect(isPromotionWithinWindow({ active: true, starts_at: null, expires_at: null }, now)).toBe(true);
  });

  it('returns false when inactive regardless of dates', () => {
    expect(isPromotionWithinWindow({ active: false, starts_at: null, expires_at: null }, now)).toBe(false);
  });

  it('returns false when starts_at is in the future', () => {
    expect(isPromotionWithinWindow({ active: true, starts_at: future, expires_at: null }, now)).toBe(false);
  });

  it('returns true when starts_at is in the past', () => {
    expect(isPromotionWithinWindow({ active: true, starts_at: past, expires_at: null }, now)).toBe(true);
  });

  it('returns false when expires_at is in the past', () => {
    expect(isPromotionWithinWindow({ active: true, starts_at: null, expires_at: past }, now)).toBe(false);
  });

  it('returns true when expires_at is in the future', () => {
    expect(isPromotionWithinWindow({ active: true, starts_at: null, expires_at: future }, now)).toBe(true);
  });

  it('returns true when both dates are set and now is within window', () => {
    expect(isPromotionWithinWindow({ active: true, starts_at: past, expires_at: future }, now)).toBe(true);
  });

  it('returns false when both dates are set and now is outside window (before)', () => {
    expect(isPromotionWithinWindow({ active: true, starts_at: future, expires_at: future }, now)).toBe(false);
  });
});

describe('isPromotionWithinUsageLimit', () => {
  it('returns true when usage_limit is null (unlimited)', () => {
    expect(isPromotionWithinUsageLimit({ usage_limit: null, usage_count: 9999 })).toBe(true);
  });

  it('returns true when usage_count is below limit', () => {
    expect(isPromotionWithinUsageLimit({ usage_limit: 10, usage_count: 9 })).toBe(true);
  });

  it('returns false when usage_count equals limit', () => {
    expect(isPromotionWithinUsageLimit({ usage_limit: 10, usage_count: 10 })).toBe(false);
  });

  it('returns false when usage_count exceeds limit', () => {
    expect(isPromotionWithinUsageLimit({ usage_limit: 5, usage_count: 6 })).toBe(false);
  });

  it('returns true when limit is 1 and count is 0', () => {
    expect(isPromotionWithinUsageLimit({ usage_limit: 1, usage_count: 0 })).toBe(true);
  });
});

describe('isPromotionEligible', () => {
  const eligible = {
    active: true,
    starts_at: null,
    expires_at: null,
    usage_limit: null,
    usage_count: 0,
  };

  it('returns true for a fully eligible promotion', () => {
    expect(isPromotionEligible(eligible, now)).toBe(true);
  });

  it('returns false when promotion is inactive', () => {
    expect(isPromotionEligible({ ...eligible, active: false }, now)).toBe(false);
  });

  it('returns false when promotion has not started', () => {
    expect(isPromotionEligible({ ...eligible, starts_at: future }, now)).toBe(false);
  });

  it('returns false when promotion is expired', () => {
    expect(isPromotionEligible({ ...eligible, expires_at: past }, now)).toBe(false);
  });

  it('returns false when usage limit is exhausted', () => {
    expect(isPromotionEligible({ ...eligible, usage_limit: 5, usage_count: 5 }, now)).toBe(false);
  });

  it('returns false when both window and usage fail', () => {
    expect(isPromotionEligible({ ...eligible, active: false, usage_limit: 5, usage_count: 5 }, now)).toBe(false);
  });
});
