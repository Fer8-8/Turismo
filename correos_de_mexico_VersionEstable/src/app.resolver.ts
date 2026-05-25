import { Resolver, Query } from '@nestjs/graphql';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Resolver()
export class AppResolver {
  @Query(() => String)
  @AllowAnonymous()
  hello(): string {
    return 'Hello World!';
  }
}
