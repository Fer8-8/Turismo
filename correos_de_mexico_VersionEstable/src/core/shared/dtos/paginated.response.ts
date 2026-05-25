import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

const paginatedTypeCache = new Map<Type, Type>();

// factory para crear tipos paginados genéricos graphql
export function Paginated<T>(classRef: Type<T>) {
  if (paginatedTypeCache.has(classRef)) {
    return paginatedTypeCache.get(classRef) as Type<{
      items: T[];
      totalCount: number;
      hasMore: boolean;
    }>;
  }

  @ObjectType(`Paginated${classRef.name}`)
  class PaginatedType {
    @Field(() => [classRef])
    items: T[];

    @Field(() => Int)
    totalCount: number;

    @Field()
    hasMore: boolean;
  }

  paginatedTypeCache.set(classRef, PaginatedType as any);

  return PaginatedType as Type<{
    items: T[];
    totalCount: number;
    hasMore: boolean;
  }>;
}
