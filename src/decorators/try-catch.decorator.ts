// decorators/try-catch.decorator.ts
import { Logger } from '@nestjs/common';

export function TryCatch(errorMessage?: string): MethodDecorator {
  const logger = new Logger('TryCatch');

  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        logger.error(`[${String(propertyKey)}] ${error.message}`, error.stack);
        throw new Error(errorMessage || error.message || 'Service Error');
      }
    };

    return descriptor;
  };
}
