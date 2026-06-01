import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CurrenciesService } from './currencies.service';
import { Currency } from './entities/currency.entity';
import { CreateCurrencyInput } from './dto/create-currency.input';
import { UpdateCurrencyInput } from './dto/update-currency.input';

@Resolver(() => Currency)
export class CurrenciesResolver {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Mutation(() => Currency)
  createCurrency(@Args('createCurrencyInput') createCurrencyInput: CreateCurrencyInput): Promise<Currency> {
    return this.currenciesService.create(createCurrencyInput);
  }

  @Query(() => [Currency], { name: 'currencies' })
  findAll(): Promise<Currency[]> {
    return this.currenciesService.findAll();
  }

  @Query(() => Currency, { name: 'currency' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Currency> {
    return this.currenciesService.findOne(id);
  }

  @Mutation(() => Currency)  
  updateCurrency(@Args('updateCurrencyInput') updateCurrencyInput: UpdateCurrencyInput): Promise<Currency> {
    return this.currenciesService.update(updateCurrencyInput.id, updateCurrencyInput);
  }

  // @Mutation(() => Currency)
  // removeCurrency(@Args('id', { type: () => String }) id: string): Promise<Currency> {
  //   return this.currenciesService.remove(id);
  // }
}
