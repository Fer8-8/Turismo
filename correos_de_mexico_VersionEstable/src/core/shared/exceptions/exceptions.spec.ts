import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { AppValidationException } from './validation.exception';
import { AppNotFoundException } from './not-found.exception';
import { AppConflictException } from './conflict.exception';
import { BusinessException } from './business.exception';
import { MissingStoreIdException } from './missing-store-id.exception';
import { UnauthorizedAccessException } from './unauthorized-access.exception';

describe('Custom Exceptions', () => {
  describe('AppException', () => {
    it('should create with message, code, and default status', () => {
      const ex = new AppException('test error', 'TEST_CODE');

      expect(ex.message).toBe('test error');
      expect(ex.code).toBe('TEST_CODE');
      expect(ex.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should create with custom status', () => {
      const ex = new AppException('test', 'CODE', HttpStatus.BAD_REQUEST);

      expect(ex.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should be instanceof HttpException', () => {
      const ex = new AppException('test', 'CODE');

      expect(ex).toBeInstanceOf(AppException);
    });
  });

  describe('AppValidationException', () => {
    it('should store validation errors', () => {
      const errors = {
        email: ['email must be valid'],
        name: ['name is required'],
      };
      const ex = new AppValidationException(errors);

      expect(ex.errors).toEqual(errors);
      expect(ex.code).toBe('VALIDATION_ERROR');
      expect(ex.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('AppNotFoundException', () => {
    it('should include resource name and id', () => {
      const ex = new AppNotFoundException('Order', 'order-123');

      expect(ex.message).toBe('Order con id "order-123" no encontrado');
      expect(ex.code).toBe('NOT_FOUND');
      expect(ex.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

    it('should work without id', () => {
      const ex = new AppNotFoundException('Product');

      expect(ex.message).toBe('Product no encontrado');
    });
  });

  describe('AppConflictException', () => {
    it('should create with message', () => {
      const ex = new AppConflictException('Email already exists');

      expect(ex.message).toBe('Email already exists');
      expect(ex.code).toBe('CONFLICT');
      expect(ex.getStatus()).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('BusinessException', () => {
    it('should create with default code', () => {
      const ex = new BusinessException('Insufficient stock');

      expect(ex.message).toBe('Insufficient stock');
      expect(ex.code).toBe('BUSINESS_RULE_VIOLATION');
      expect(ex.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should accept custom code', () => {
      const ex = new BusinessException('Out of stock', 'OUT_OF_STOCK');

      expect(ex.code).toBe('OUT_OF_STOCK');
    });
  });

  describe('MissingStoreIdException', () => {
    it('should create with correct message and code', () => {
      const ex = new MissingStoreIdException();

      expect(ex.message).toBe('Se requiere el header X-Store-Id');
      expect(ex.code).toBe('MISSING_STORE_ID');
      expect(ex.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('UnauthorizedAccessException', () => {
    it('should create with default message', () => {
      const ex = new UnauthorizedAccessException();

      expect(ex.message).toBe('No tienes acceso a este recurso');
      expect(ex.code).toBe('UNAUTHORIZED_ACCESS');
      expect(ex.getStatus()).toBe(HttpStatus.FORBIDDEN);
    });

    it('should accept custom message', () => {
      const ex = new UnauthorizedAccessException('Custom msg');

      expect(ex.message).toBe('Custom msg');
    });
  });
});
