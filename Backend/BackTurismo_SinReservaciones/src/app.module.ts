import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { PlacesModule } from './places/places.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from '@thallesp/nestjs-better-auth'
import { auth } from './lib/auth';
import { StatesModule } from './states/states.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule as LocalAuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { PlannerModule } from './planner/planner.module';
import { EventsModule } from './events/events.module';
import { LanguagesModule } from './languages/languages.module';
import { AuthResModule } from './auth-res/auth-res.module';
import { MediaModule } from './media/media.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { TagsModule } from './tags/tags.module';
import { UserfeaturescacheModule } from './userfeaturescache/userfeaturescache.module';
import { ContactDetailsModule } from './contact_details/contact_details.module';
import { PlaceAttributesModule } from './place-attributes/place-attributes.module';
import { PlaceActivitiesModule } from './place-activities/place-activities.module';
import { PlaceTagsModule } from './place-tags/place-tags.module';
import { RecommendationLogsModule } from './recommendation-logs/recommendation-logs.module';
import { UserSessionModule } from './user_session/user_session.module';
import { StorageModule } from './storage/storage.module';
import { ActivitiesPlannerModule } from './activities_planner/activities_planner.module';
import { PlaceRequestModule } from './place_request/place_request.module';
import { PlacefeaturecacheModule } from './placefeaturecache/placefeaturecache.module';
import { FavoritesModule } from './favorites/favorites.module';


@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      csrfPrevention: false,
      context: ({ req, res }) => ({ req, res }),
    }),
    PrismaModule,
    PlacesModule,
    StatesModule,
    CategoriesModule,
    UsersModule,   
    LocalAuthModule, 
    PaymentModule, 
    PlannerModule,
    LocalAuthModule, 
    PaymentModule, 
    EventsModule, 
    LanguagesModule, 
    AuthResModule,
    MediaModule,
    CurrenciesModule, 
    TagsModule, 
    UserfeaturescacheModule,
    UserSessionModule, 
    PlaceAttributesModule, 
    PlaceActivitiesModule, 
    PlaceTagsModule, 
    RecommendationLogsModule, 
    ContactDetailsModule,
    StorageModule,
    ActivitiesPlannerModule,
    PlaceRequestModule,
    PlacefeaturecacheModule,
    FavoritesModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    AppResolver,
  ],
})
export class AppModule {}
