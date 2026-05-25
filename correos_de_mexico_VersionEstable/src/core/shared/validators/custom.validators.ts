import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// validador de email
@ValidatorConstraint({ name: 'isValidEmail', async: false })
export class IsValidEmailConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  defaultMessage(): string {
    return 'El correo electrónico no es válido';
  }
}

export function IsValidEmail(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidEmailConstraint,
    });
  };
}

// validador de teléfono (formato: +xx xxxxxxxxxx o similar)
@ValidatorConstraint({ name: 'isValidPhone', async: false })
export class IsValidPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const phoneRegex = /^(\+\d{1,3})?[\s.-]?\d{7,14}$/;
    return phoneRegex.test(value.replace(/[\s.-]/g, ''));
  }

  defaultMessage(): string {
    return 'El teléfono no es válido';
  }
}

export function IsValidPhone(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPhoneConstraint,
    });
  };
}

// validador de uuid
@ValidatorConstraint({ name: 'isValidUUID', async: false })
export class IsValidUUIDConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  defaultMessage(): string {
    return 'El valor debe ser un UUID válido';
  }
}

export function IsValidUUID(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidUUIDConstraint,
    });
  };
}

// validador de store_id (debe ser uuid válido)
@ValidatorConstraint({ name: 'isValidStoreId', async: false })
export class IsValidStoreIdConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  defaultMessage(): string {
    return 'Store ID must be a valid UUID';
  }
}

export function IsValidStoreId(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidStoreIdConstraint,
    });
  };
}

/**
 * POSITIVE NUMBER VALIDATOR
 */
@ValidatorConstraint({ name: 'isPositive', async: false })
export class IsPositiveConstraint implements ValidatorConstraintInterface {
  validate(value: number): boolean {
    return value > 0;
  }

  defaultMessage(): string {
    return 'Value must be a positive number';
  }
}

export function IsPositive(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositiveConstraint,
    });
  };
}

/**
 * ZIPCODE VALIDATOR (formato flexible: 12345, 12345-6789, etc.)
 */
@ValidatorConstraint({ name: 'isValidZipcode', async: false })
export class IsValidZipcodeConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    // Acepta 5+ dígitos opcionalmente con separadores
    const zipcodeRegex = /^\d{5}(-\d{4})?$/;
    return zipcodeRegex.test(value);
  }

  defaultMessage(): string {
    return 'Zipcode must be in valid format (e.g., 12345 or 12345-6789)';
  }
}

export function IsValidZipcode(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidZipcodeConstraint,
    });
  };
}
