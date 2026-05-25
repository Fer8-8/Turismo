import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { StoreContextGuard } from './store-context.guard';
import { MissingStoreIdException, UnauthorizedAccessException } from '../exceptions/index';

// Mock de GqlExecutionContext
jest.mock('@nestjs/graphql', () => {
  const actual = jest.requireActual('@nestjs/graphql');
  return {
    ...actual,
    GqlExecutionContext: {
      create: jest.fn(),
    },
  };
});

describe('StoreContextGuard', () => {
  let guard: StoreContextGuard;
  let reflector: Reflector;
  let prismaMock: {
    store: { findUnique: jest.Mock };
    cdmUser: { findUnique: jest.Mock };
  };

  beforeEach(() => {
    reflector = new Reflector();
    prismaMock = {
      store: { findUnique: jest.fn() },
      cdmUser: { findUnique: jest.fn() },
    };
    guard = new StoreContextGuard(reflector, prismaMock as any);
  });

  function mockContext(headers: Record<string, string>, skipMeta = false) {
    const req: Record<string, unknown> = { headers };
    const mockExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    (GqlExecutionContext.create as jest.Mock).mockReturnValue({
      getContext: () => ({ req }),
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(skipMeta);

    return { req, mockExecutionContext };
  }

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow request when X-Store-Id is present and store exists', async () => {
    prismaMock.store.findUnique.mockResolvedValue({ id: 'store-123', name: 'Test Store' });
    const { req, mockExecutionContext } = mockContext({ 'x-store-id': 'store-123' });

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(req.storeContext).toEqual({ storeId: 'store-123' });
    expect(prismaMock.store.findUnique).toHaveBeenCalledWith({ where: { id: 'store-123' } });
  });

  it('should trim the store id before lookup', async () => {
    prismaMock.store.findUnique.mockResolvedValue({ id: 'store-456' });
    const { req, mockExecutionContext } = mockContext({ 'x-store-id': '  store-456  ' });

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(req.storeContext).toEqual({ storeId: 'store-456' });
    expect(prismaMock.store.findUnique).toHaveBeenCalledWith({ where: { id: 'store-456' } });
  });

  it('should throw MissingStoreIdException when header is missing', async () => {
    const { mockExecutionContext } = mockContext({});

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      MissingStoreIdException,
    );
  });

  it('should throw MissingStoreIdException when header is empty', async () => {
    const { mockExecutionContext } = mockContext({ 'x-store-id': '' });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      MissingStoreIdException,
    );
  });

  it('should throw MissingStoreIdException when header is whitespace only', async () => {
    const { mockExecutionContext } = mockContext({ 'x-store-id': '   ' });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      MissingStoreIdException,
    );
  });

  it('should skip validation when @SkipStoreContext() is set', async () => {
    const { mockExecutionContext } = mockContext({}, true);

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(prismaMock.store.findUnique).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedAccessException when store does not exist', async () => {
    prismaMock.store.findUnique.mockResolvedValue(null);
    const { mockExecutionContext } = mockContext({ 'x-store-id': 'nonexistent' });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedAccessException,
    );
  });
});
