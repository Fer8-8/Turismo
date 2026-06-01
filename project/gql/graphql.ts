// biome-ignore-all lint: auto-generated files
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
};

export type ActivitiesPlanner = {
  __typename?: "ActivitiesPlanner";
  day?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  id_planner?: Maybe<Scalars["String"]["output"]>;
  places?: Maybe<Array<Place>>;
  planner?: Maybe<Planner>;
};

export type ActivitiesPlannerResponse = {
  __typename?: "ActivitiesPlannerResponse";
  activities_planners: Array<ActivitiesPlanner>;
  info: Info;
};

export type AuthResponse = {
  __typename?: "AuthResponse";
  token: Scalars["String"]["output"];
  user: User;
};

/** Tipos de playa disponibles para los lugares */
export enum BeachType {
  Developed = "developed",
  Na = "na",
  SemiVirgin = "semi_virgin",
  Urban = "urban",
  Virgin = "virgin",
}

export type Category = {
  __typename?: "Category";
  category: Scalars["String"]["output"];
  created_at: Scalars["DateTime"]["output"];
  id_category: Scalars["ID"]["output"];
  places: Array<Place>;
  updated_at: Scalars["DateTime"]["output"];
};

export type ChangeElement = {
  __typename?: "ChangeElement";
  /** Name of the field changed */
  field: Scalars["String"]["output"];
  new_value?: Maybe<Scalars["JSON"]["output"]>;
  old_value?: Maybe<Scalars["JSON"]["output"]>;
};

export type Contact_Detail = {
  __typename?: "Contact_detail";
  created_at?: Maybe<Scalars["DateTime"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  phone_number?: Maybe<Scalars["String"]["output"]>;
  social_media?: Maybe<Scalars["JSON"]["output"]>;
  updated_at?: Maybe<Scalars["DateTime"]["output"]>;
};

export type CreateActivitiesPlannerInput = {
  day: Scalars["DateTime"]["input"];
  id_places?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_planner?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CreateCategoryInput = {
  category: Scalars["String"]["input"];
};

export type CreateContactInput = {
  email: Scalars["String"]["input"];
  phone_number?: InputMaybe<Scalars["String"]["input"]>;
  social_media?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type CreateCurrencyInput = {
  abbr: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
};

export type CreateEventInput = {
  contactDetails_id?: InputMaybe<Scalars["ID"]["input"]>;
  details: Scalars["JSON"]["input"];
  end_date: Scalars["DateTime"]["input"];
  id_category?: InputMaybe<Scalars["ID"]["input"]>;
  id_state?: InputMaybe<Scalars["ID"]["input"]>;
  isTradition: Scalars["Boolean"]["input"];
  languages_details: Scalars["JSON"]["input"];
  name: Scalars["String"]["input"];
  start_date: Scalars["DateTime"]["input"];
};

export type CreateFavoriteInput = {
  event_id?: InputMaybe<Scalars["ID"]["input"]>;
  place_id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CreateLanguageInput = {
  abbr: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
};

export type CreatePaymentInput = {
  card_number_hashed: Scalars["String"]["input"];
  cardtype: Scalars["String"]["input"];
  cvc_hashed: Scalars["String"]["input"];
  expiry_date_hashed: Scalars["String"]["input"];
  last_4?: InputMaybe<Scalars["String"]["input"]>;
  name_card: Scalars["String"]["input"];
  surname_card: Scalars["String"]["input"];
  user_id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CreatePlaceActivityInput = {
  activity_name: Scalars["String"]["input"];
  additional_cost: Scalars["Float"]["input"];
  available_months: Scalars["JSON"]["input"];
  difficulty_level: DifficultyLevel;
  min_age: Scalars["Int"]["input"];
  place_id?: InputMaybe<Scalars["ID"]["input"]>;
  requires_equipment: Scalars["Boolean"]["input"];
};

export type CreatePlaceAttributeInput = {
  accommodation_avg_cost: Scalars["Int"]["input"];
  avg_temp_summer_celsius: Scalars["Float"]["input"];
  avg_temp_winter_celsius: Scalars["Float"]["input"];
  avoid_seasons: Scalars["JSON"]["input"];
  beach_type: BeachType;
  best_seasons: Scalars["JSON"]["input"];
  crowd_level: CrowdLevel;
  cuisine_types: Scalars["JSON"]["input"];
  culinary_speciality: Scalars["String"]["input"];
  development_level: DevelopmentLevel;
  environment_type: EnvironmentType;
  estimated_daily_cost_max: Scalars["Float"]["input"];
  estimated_daily_cost_min: Scalars["Float"]["input"];
  food_avg_cost: Scalars["Int"]["input"];
  has_gluten_free: Scalars["Boolean"]["input"];
  has_nightlife: Scalars["Boolean"]["input"];
  has_parking: Scalars["Boolean"]["input"];
  has_reef: Scalars["Boolean"]["input"];
  has_vegan_options: Scalars["Boolean"]["input"];
  has_vegetarian_options: Scalars["Boolean"]["input"];
  ideal_months: Scalars["JSON"]["input"];
  is_protected_area: Scalars["Boolean"]["input"];
  is_pueblo_magico: Scalars["Boolean"]["input"];
  is_unesco_heritage: Scalars["Boolean"]["input"];
  municipality: Scalars["String"]["input"];
  pet_friendly: Scalars["Boolean"]["input"];
  place_id?: InputMaybe<Scalars["ID"]["input"]>;
  price_level: PriceLevel;
  recommended_days: Scalars["Int"]["input"];
  requires_guide: Scalars["Boolean"]["input"];
  requires_permit: Scalars["Boolean"]["input"];
  sand_color: Scalars["String"]["input"];
  typical_visit_hours: Scalars["Float"]["input"];
  verified?: InputMaybe<Scalars["Boolean"]["input"]>;
  verified_at?: InputMaybe<Scalars["DateTime"]["input"]>;
  wave_type: WaveType;
  wheelchair_accessible: Scalars["Boolean"]["input"];
};

export type CreatePlaceInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  city_id?: InputMaybe<Scalars["ID"]["input"]>;
  contactDetails_id?: InputMaybe<Scalars["ID"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  details?: InputMaybe<Scalars["JSON"]["input"]>;
  id_category?: InputMaybe<Scalars["ID"]["input"]>;
  languages_details?: InputMaybe<Scalars["JSON"]["input"]>;
  latitude?: InputMaybe<Scalars["Float"]["input"]>;
  longitude?: InputMaybe<Scalars["Float"]["input"]>;
  name: Scalars["String"]["input"];
  state_id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CreatePlaceRequestInput = {
  id_place?: InputMaybe<Scalars["ID"]["input"]>;
  /** If left blank, it will automatically use the authenticated user's ID */
  id_user?: InputMaybe<Scalars["ID"]["input"]>;
  /** Info of the place requested to create */
  place_json: CreatePlaceInput;
  status?: Request_Status;
};

export type CreatePlaceTagInput = {
  place_id: Scalars["ID"]["input"];
  relevance_score: Scalars["Float"]["input"];
  tag_id: Scalars["ID"]["input"];
};

export type CreatePlacefeaturecacheInput = {
  avg_overral_rating: Scalars["Float"]["input"];
  avg_value_rating: Scalars["Float"]["input"];
  avg_visitor_age_rate: Scalars["String"]["input"];
  place_id?: InputMaybe<Scalars["String"]["input"]>;
  primary_travel_party_type: TravelPartyType;
  rating_count: Scalars["Int"]["input"];
  total_bookings: Scalars["Int"]["input"];
  total_favorites: Scalars["Int"]["input"];
  total_interactions: Scalars["Int"]["input"];
  total_reviews: Scalars["Int"]["input"];
  total_views: Scalars["Int"]["input"];
  trending_score: Scalars["Float"]["input"];
  views_last_7_days: Scalars["Int"]["input"];
  views_last_30_days: Scalars["Int"]["input"];
};

export type CreatePlannerInput = {
  budget: Scalars["Float"]["input"];
  end_date: Scalars["DateTime"]["input"];
  name: Scalars["String"]["input"];
  people: Scalars["Int"]["input"];
  start_date: Scalars["DateTime"]["input"];
  state_id?: InputMaybe<Scalars["String"]["input"]>;
  status: Routes_Status;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateRecommendationLogInput = {
  algorithm_version: Scalars["String"]["input"];
  model_version: Scalars["String"]["input"];
  places_clicked: Scalars["JSON"]["input"];
  places_favorited: Scalars["JSON"]["input"];
  recommended_places: Scalars["JSON"]["input"];
  request_context: Scalars["JSON"]["input"];
  session_id?: InputMaybe<Scalars["ID"]["input"]>;
  time_to_first_click_seconds: Scalars["Int"]["input"];
  total_engagement_score: Scalars["Float"]["input"];
  user_id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CreateStateInput = {
  created_at?: InputMaybe<Scalars["DateTime"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  extension?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  population?: InputMaybe<Scalars["Int"]["input"]>;
  region: Scalars["String"]["input"];
  updated_at?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type CreateTagInput = {
  tag_category: TagCategory;
  tag_name: Scalars["String"]["input"];
};

export type CreateUserInput = {
  email: Scalars["String"]["input"];
  id_currency?: InputMaybe<Scalars["ID"]["input"]>;
  id_language?: InputMaybe<Scalars["ID"]["input"]>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  managedStateId?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  password?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Role>;
};

export type CreateUserSessionInput = {
  browser: Scalars["String"]["input"];
  city: Scalars["String"]["input"];
  country: Scalars["String"]["input"];
  device_os: Scalars["String"]["input"];
  /** Device session type (mobile | desktop) */
  device_type: Device_Types;
  duration_seconds: Scalars["Int"]["input"];
  ended_at: Scalars["DateTime"]["input"];
  had_favorite: Scalars["Boolean"]["input"];
  had_interaction: Scalars["Boolean"]["input"];
  ip_address: Scalars["String"]["input"];
  page_views: Scalars["Int"]["input"];
  started_at: Scalars["DateTime"]["input"];
  state: Scalars["String"]["input"];
  user_id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CreateUserfeaturescacheInput = {
  adventure_level_score: Scalars["Float"]["input"];
  avg_daily_cost_preference: Scalars["Int"]["input"];
  avg_price_level_interacted: Scalars["String"]["input"];
  avg_session_duration_seconds: Scalars["Int"]["input"];
  beach_preference_score: Scalars["Float"]["input"];
  booking_conversation_ratio: Scalars["Float"]["input"];
  cultural_interest_score: Scalars["Float"]["input"];
  favorite_ratio: Scalars["Float"]["input"];
  last_interaction_at: Scalars["DateTime"]["input"];
  nightlife_interest_score: Scalars["Float"]["input"];
  top_activities: Scalars["JSON"]["input"];
  top_categories: Scalars["JSON"]["input"];
  top_states: Scalars["JSON"]["input"];
  total_booking?: InputMaybe<Scalars["Int"]["input"]>;
  total_favorites?: InputMaybe<Scalars["Int"]["input"]>;
  total_interactions?: InputMaybe<Scalars["Int"]["input"]>;
  total_views?: InputMaybe<Scalars["Int"]["input"]>;
  user_id: Scalars["ID"]["input"];
};

/** Niveles de multitud disponibles para los lugares */
export enum CrowdLevel {
  Crowded = "crowded",
  Moderate = "moderate",
  Na = "na",
  Solitary = "solitary",
  Tranquil = "tranquil",
  VeryCrowded = "very_crowded",
}

export type Currency = {
  __typename?: "Currency";
  abbr: Scalars["String"]["output"];
  created_at: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  updated_at: Scalars["DateTime"]["output"];
  users?: Maybe<Array<User>>;
};

/** Niveles de desarrollo disponibles para los lugares */
export enum DevelopmentLevel {
  Commercial = "commercial",
  High = "high",
  Minimum = "minimum",
  Moderate = "moderate",
  Na = "na",
  Virgin = "virgin",
}

/** Niveles de dificultad disponibles para las actividades */
export enum DifficultyLevel {
  Easy = "easy",
  Hard = "hard",
  Medium = "medium",
}

/** Tipos de ambiente disponibles para los lugares */
export enum EnvironmentType {
  Mixed = "mixed",
  Na = "na",
  Natural = "natural",
  Rural = "rural",
  Urban = "urban",
}

export type Event = {
  __typename?: "Event";
  category?: Maybe<Category>;
  contactDetails_id?: Maybe<Scalars["ID"]["output"]>;
  created_at: Scalars["DateTime"]["output"];
  details: Scalars["JSON"]["output"];
  end_date: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  id_category?: Maybe<Scalars["ID"]["output"]>;
  id_state?: Maybe<Scalars["ID"]["output"]>;
  isTradition: Scalars["Boolean"]["output"];
  languages_details: Scalars["JSON"]["output"];
  medias?: Maybe<Array<Media>>;
  name: Scalars["String"]["output"];
  start_date: Scalars["DateTime"]["output"];
  state?: Maybe<State>;
  updated_at: Scalars["DateTime"]["output"];
};

export type EventsResponse = {
  __typename?: "EventsResponse";
  events: Array<Event>;
  info: Info;
};

export type Favorite = {
  __typename?: "Favorite";
  created_at: Scalars["DateTime"]["output"];
  event?: Maybe<Array<Event>>;
  id: Scalars["ID"]["output"];
  id_user?: Maybe<Scalars["String"]["output"]>;
  place?: Maybe<Array<Place>>;
  updated_at: Scalars["DateTime"]["output"];
};

export type FavoritesResponse = {
  __typename?: "FavoritesResponse";
  favorites: Array<Favorite>;
  info: Info;
};

export type Info = {
  __typename?: "Info";
  count: Scalars["Int"]["output"];
  next?: Maybe<Scalars["Int"]["output"]>;
  pages: Scalars["Int"]["output"];
  prev?: Maybe<Scalars["Int"]["output"]>;
};

export type Language = {
  __typename?: "Language";
  abbr: Scalars["String"]["output"];
  created_at: Scalars["DateTime"]["output"];
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  updated_at: Scalars["DateTime"]["output"];
  users?: Maybe<Array<User>>;
};

export type LoginUserInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Media = {
  __typename?: "Media";
  alt_text: Scalars["String"]["output"];
  created_at: Scalars["DateTime"]["output"];
  event?: Maybe<Event>;
  event_id?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  isCover: Scalars["Boolean"]["output"];
  metadata?: Maybe<Scalars["JSON"]["output"]>;
  mime_type: Scalars["String"]["output"];
  miniature_url?: Maybe<Scalars["String"]["output"]>;
  place?: Maybe<Place>;
  place_activities?: Maybe<PlaceActivity>;
  place_activities_id?: Maybe<Scalars["String"]["output"]>;
  place_id?: Maybe<Scalars["String"]["output"]>;
  review_id?: Maybe<Scalars["String"]["output"]>;
  size?: Maybe<Scalars["Float"]["output"]>;
  status: MediaStatus;
  stream_url?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["DateTime"]["output"];
  url: Scalars["String"]["output"];
  user?: Maybe<User>;
  user_id?: Maybe<Scalars["String"]["output"]>;
};

export type MediaResponse = {
  __typename?: "MediaResponse";
  info: Info;
  media: Array<Media>;
};

/** Status of the media upload */
export enum MediaStatus {
  Failed = "FAILED",
  Pending = "PENDING",
  Ready = "READY",
}

export type Mutation = {
  __typename?: "Mutation";
  createActivitiesPlanner: ActivitiesPlanner;
  createCategory: Category;
  createContact: Contact_Detail;
  createCurrency: Currency;
  createEvent: Event;
  createFavorite: Favorite;
  createLanguage: Language;
  createPayment: Payment;
  createPlace: Place;
  createPlaceActivity: PlaceActivity;
  createPlaceAttribute: PlaceAttribute;
  createPlaceRequest: PlaceRequest;
  createPlaceTag: PlaceTag;
  createPlacefeaturecache: Placefeaturecache;
  createPlanner: Planner;
  createRecommendationLog: RecommendationLog;
  createState: State;
  createTag: Tag;
  createUser: User;
  /** create a new user session */
  createUserSession: UserSession;
  createUserfeaturescache: Userfeaturescache;
  login: AuthResponse;
  loginAnonymously: AuthResponse;
  register: AuthResponse;
  removeCategory: Category;
  removeEvent: Event;
  removeFavorite: Favorite;
  removeLanguage: Language;
  removePayment: Payment;
  removePlace: Place;
  removePlaceActivity: PlaceActivity;
  removePlaceRequest: PlaceRequest;
  removePlaceTag: PlaceTag;
  removeUser: User;
  reviewPlaceRequest: PlaceRequest;
  updateActivitiesPlanner: ActivitiesPlanner;
  updateCategory: Category;
  updateCurrency: Currency;
  updateEvent: Event;
  updateLanguage: Language;
  updateMedia: Media;
  updatePayment: Payment;
  updatePlace: Place;
  updatePlaceActivity: PlaceActivity;
  updatePlaceAttribute: PlaceAttribute;
  updatePlaceRequest: PlaceRequest;
  updatePlaceTag: PlaceTag;
  updatePlacefeaturecache: Placefeaturecache;
  updatePlanner: Planner;
  updateState: State;
  updateTag: Tag;
  updateUser: User;
  updateUserSession: UserSession;
};

export type MutationCreateActivitiesPlannerArgs = {
  createActivitiesPlannerInput: CreateActivitiesPlannerInput;
};

export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
};

export type MutationCreateContactArgs = {
  createCategoryInput: CreateContactInput;
};

export type MutationCreateCurrencyArgs = {
  createCurrencyInput: CreateCurrencyInput;
};

export type MutationCreateEventArgs = {
  createEventInput: CreateEventInput;
};

export type MutationCreateFavoriteArgs = {
  createFavoriteInput: CreateFavoriteInput;
};

export type MutationCreateLanguageArgs = {
  createLanguageInput: CreateLanguageInput;
};

export type MutationCreatePaymentArgs = {
  createPaymentInput: CreatePaymentInput;
};

export type MutationCreatePlaceArgs = {
  createPlaceInput: CreatePlaceInput;
};

export type MutationCreatePlaceActivityArgs = {
  createPlaceActivityInput: CreatePlaceActivityInput;
};

export type MutationCreatePlaceAttributeArgs = {
  createPlaceAttributeInput: CreatePlaceAttributeInput;
};

export type MutationCreatePlaceRequestArgs = {
  createPlaceRequestInput: CreatePlaceRequestInput;
};

export type MutationCreatePlaceTagArgs = {
  createPlaceTagInput: CreatePlaceTagInput;
};

export type MutationCreatePlacefeaturecacheArgs = {
  createPlacefeaturecacheInput: CreatePlacefeaturecacheInput;
};

export type MutationCreatePlannerArgs = {
  createPlannerInput: CreatePlannerInput;
};

export type MutationCreateRecommendationLogArgs = {
  createRecommendationLogInput: CreateRecommendationLogInput;
};

export type MutationCreateStateArgs = {
  createStateInput: CreateStateInput;
};

export type MutationCreateTagArgs = {
  createTagInput: CreateTagInput;
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationCreateUserSessionArgs = {
  createUserSessionInput: CreateUserSessionInput;
};

export type MutationCreateUserfeaturescacheArgs = {
  createUserfeaturescacheInput: CreateUserfeaturescacheInput;
};

export type MutationLoginArgs = {
  loginUserInput: LoginUserInput;
};

export type MutationRegisterArgs = {
  registerUserInput: RegisterUserInput;
};

export type MutationRemoveCategoryArgs = {
  id_category: Scalars["ID"]["input"];
};

export type MutationRemoveEventArgs = {
  id: Scalars["String"]["input"];
};

export type MutationRemoveFavoriteArgs = {
  id: Scalars["String"]["input"];
};

export type MutationRemoveLanguageArgs = {
  id: Scalars["String"]["input"];
};

export type MutationRemovePaymentArgs = {
  id: Scalars["String"]["input"];
};

export type MutationRemovePlaceArgs = {
  id: Scalars["String"]["input"];
};

export type MutationRemovePlaceActivityArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemovePlaceRequestArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemovePlaceTagArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveUserArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationReviewPlaceRequestArgs = {
  id: Scalars["ID"]["input"];
  status: Request_Status;
};

export type MutationUpdateActivitiesPlannerArgs = {
  updateActivitiesPlannerInput: UpdateActivitiesPlannerInput;
};

export type MutationUpdateCategoryArgs = {
  updateCategoryInput: UpdateCategoryInput;
};

export type MutationUpdateCurrencyArgs = {
  updateCurrencyInput: UpdateCurrencyInput;
};

export type MutationUpdateEventArgs = {
  updateEventInput: UpdateEventInput;
};

export type MutationUpdateLanguageArgs = {
  updateLanguageInput: UpdateLanguageInput;
};

export type MutationUpdateMediaArgs = {
  updateMediaInput: UpdateMediaInput;
};

export type MutationUpdatePaymentArgs = {
  updatePaymentInput: UpdatePaymentInput;
};

export type MutationUpdatePlaceArgs = {
  updatePlaceInput: UpdatePlaceInput;
};

export type MutationUpdatePlaceActivityArgs = {
  updatePlaceActivityInput: UpdatePlaceActivityInput;
};

export type MutationUpdatePlaceAttributeArgs = {
  updatePlaceAttributeInput: UpdatePlaceAttributeInput;
};

export type MutationUpdatePlaceRequestArgs = {
  updatePlaceRequestInput: UpdatePlaceRequestInput;
};

export type MutationUpdatePlaceTagArgs = {
  updatePlaceTagInput: UpdatePlaceTagInput;
};

export type MutationUpdatePlacefeaturecacheArgs = {
  updatePlacefeaturecacheInput: UpdatePlacefeaturecacheInput;
};

export type MutationUpdatePlannerArgs = {
  updatePlannerInput: UpdatePlannerInput;
};

export type MutationUpdateStateArgs = {
  updateStateInput: UpdateStateInput;
};

export type MutationUpdateTagArgs = {
  updateTagInput: UpdateTagInput;
};

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type MutationUpdateUserSessionArgs = {
  updateUserSessionInput: UpdateUserSessionInput;
};

export type Payment = {
  __typename?: "Payment";
  card_number_hashed: Scalars["String"]["output"];
  cardtype: Scalars["String"]["output"];
  created_at: Scalars["DateTime"]["output"];
  cvc_hashed: Scalars["String"]["output"];
  expiry_date_hashed: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  last_4?: Maybe<Scalars["String"]["output"]>;
  name_card: Scalars["String"]["output"];
  surname_card: Scalars["String"]["output"];
  updated_at: Scalars["DateTime"]["output"];
  user: User;
  user_id: Scalars["ID"]["output"];
};

export type Place = {
  __typename?: "Place";
  address?: Maybe<Scalars["String"]["output"]>;
  category?: Maybe<Category>;
  city?: Maybe<Place>;
  city_id?: Maybe<Scalars["ID"]["output"]>;
  contactDetails_id?: Maybe<Scalars["ID"]["output"]>;
  created_at?: Maybe<Scalars["DateTime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  details?: Maybe<Scalars["JSON"]["output"]>;
  /** Distance in kilometers (only nerby method) */
  distance?: Maybe<Scalars["Float"]["output"]>;
  id: Scalars["ID"]["output"];
  id_category?: Maybe<Scalars["ID"]["output"]>;
  languages_details?: Maybe<Scalars["JSON"]["output"]>;
  latitude?: Maybe<Scalars["Float"]["output"]>;
  longitude?: Maybe<Scalars["Float"]["output"]>;
  medias?: Maybe<Array<Media>>;
  name: Scalars["String"]["output"];
  placeAttributes?: Maybe<PlaceAttribute>;
  placeTags?: Maybe<Array<PlaceTag>>;
  places?: Maybe<Array<Place>>;
  state?: Maybe<State>;
  state_id?: Maybe<Scalars["ID"]["output"]>;
  updated_at?: Maybe<Scalars["DateTime"]["output"]>;
};

export type PlaceActivitiesResponse = {
  __typename?: "PlaceActivitiesResponse";
  info: Info;
  placeActivities: Array<PlaceActivity>;
};

export type PlaceActivity = {
  __typename?: "PlaceActivity";
  Place?: Maybe<Place>;
  activity_name: Scalars["String"]["output"];
  additional_cost: Scalars["Float"]["output"];
  available_months: Scalars["JSON"]["output"];
  created_at: Scalars["DateTime"]["output"];
  difficulty_level: DifficultyLevel;
  id: Scalars["ID"]["output"];
  media?: Maybe<Array<Media>>;
  min_age: Scalars["Int"]["output"];
  place_id?: Maybe<Scalars["ID"]["output"]>;
  requires_equipment: Scalars["Boolean"]["output"];
  updated_at: Scalars["DateTime"]["output"];
};

export type PlaceAttribute = {
  __typename?: "PlaceAttribute";
  Place?: Maybe<Place>;
  accommodation_avg_cost: Scalars["Int"]["output"];
  avg_temp_summer_celsius: Scalars["Float"]["output"];
  avg_temp_winter_celsius: Scalars["Float"]["output"];
  avoid_seasons: Scalars["JSON"]["output"];
  beach_type: BeachType;
  best_seasons: Scalars["JSON"]["output"];
  created_at?: Maybe<Scalars["DateTime"]["output"]>;
  crowd_level: CrowdLevel;
  cuisine_types: Scalars["JSON"]["output"];
  culinary_speciality?: Maybe<Scalars["String"]["output"]>;
  development_level: DevelopmentLevel;
  environment_type: EnvironmentType;
  estimated_daily_cost_max?: Maybe<Scalars["Float"]["output"]>;
  estimated_daily_cost_min?: Maybe<Scalars["Float"]["output"]>;
  food_avg_cost: Scalars["Int"]["output"];
  has_gluten_free: Scalars["Boolean"]["output"];
  has_nightlife: Scalars["Boolean"]["output"];
  has_parking: Scalars["Boolean"]["output"];
  has_reef: Scalars["Boolean"]["output"];
  has_vegan_options: Scalars["Boolean"]["output"];
  has_vegetarian_options: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  ideal_months: Scalars["JSON"]["output"];
  is_protected_area: Scalars["Boolean"]["output"];
  is_pueblo_magico: Scalars["Boolean"]["output"];
  is_unesco_heritage: Scalars["Boolean"]["output"];
  municipality: Scalars["String"]["output"];
  pet_friendly: Scalars["Boolean"]["output"];
  place_id?: Maybe<Scalars["ID"]["output"]>;
  price_level: PriceLevel;
  recommended_days?: Maybe<Scalars["Int"]["output"]>;
  requires_guide: Scalars["Boolean"]["output"];
  requires_permit: Scalars["Boolean"]["output"];
  sand_color: Scalars["String"]["output"];
  typical_visit_hours?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["DateTime"]["output"]>;
  verified?: Maybe<Scalars["Boolean"]["output"]>;
  verified_at?: Maybe<Scalars["DateTime"]["output"]>;
  wave_type: WaveType;
  wheelchair_accessible: Scalars["Boolean"]["output"];
};

export type PlaceDraft = {
  __typename?: "PlaceDraft";
  address: Scalars["String"]["output"];
  contactDetails_id?: Maybe<Scalars["ID"]["output"]>;
  description: Scalars["String"]["output"];
  details?: Maybe<Scalars["JSON"]["output"]>;
  id_category?: Maybe<Scalars["ID"]["output"]>;
  languages_details?: Maybe<Scalars["JSON"]["output"]>;
  latitude: Scalars["Float"]["output"];
  longitude: Scalars["Float"]["output"];
  name: Scalars["String"]["output"];
  state_id?: Maybe<Scalars["ID"]["output"]>;
};

export type PlaceRequest = {
  __typename?: "PlaceRequest";
  created_at: Scalars["DateTime"]["output"];
  /** History of changes made to the request */
  history_json?: Maybe<Array<RequestHistoryEntry>>;
  id: Scalars["ID"]["output"];
  id_place?: Maybe<Scalars["ID"]["output"]>;
  id_user: Scalars["ID"]["output"];
  place?: Maybe<Place>;
  /** Info of the place requested to create */
  place_json: PlaceDraft;
  /** Request Status */
  status: Request_Status;
  updated_at: Scalars["DateTime"]["output"];
  user: User;
};

export type PlaceRequestResponse = {
  __typename?: "PlaceRequestResponse";
  info: Info;
  place_requests: Array<PlaceRequest>;
};

export type PlaceTag = {
  __typename?: "PlaceTag";
  Place?: Maybe<Place>;
  Tag?: Maybe<Tag>;
  id: Scalars["ID"]["output"];
  place_id?: Maybe<Scalars["ID"]["output"]>;
  relevance_score: Scalars["Float"]["output"];
  tag_id?: Maybe<Scalars["ID"]["output"]>;
};

export type Placefeaturecache = {
  __typename?: "Placefeaturecache";
  Place?: Maybe<Place>;
  avg_overral_rating: Scalars["Float"]["output"];
  avg_value_rating: Scalars["Float"]["output"];
  avg_visitor_age_rate: Scalars["String"]["output"];
  created_at: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  place_id?: Maybe<Scalars["String"]["output"]>;
  primary_travel_party_type: TravelPartyType;
  rating_count: Scalars["Int"]["output"];
  total_bookings: Scalars["Int"]["output"];
  total_favorites: Scalars["Int"]["output"];
  total_interactions: Scalars["Int"]["output"];
  total_reviews: Scalars["Int"]["output"];
  total_views: Scalars["Int"]["output"];
  trending_score: Scalars["Float"]["output"];
  updated_at: Scalars["DateTime"]["output"];
  views_last_7_days: Scalars["Int"]["output"];
  views_last_30_days: Scalars["Int"]["output"];
};

export type PlacesResponse = {
  __typename?: "PlacesResponse";
  info: Info;
  places: Array<Place>;
};

export type Planner = {
  __typename?: "Planner";
  budget: Scalars["Float"]["output"];
  created_at: Scalars["DateTime"]["output"];
  end_date: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  people: Scalars["Int"]["output"];
  start_date: Scalars["DateTime"]["output"];
  state?: Maybe<State>;
  state_id?: Maybe<Scalars["String"]["output"]>;
  status: Routes_Status;
  updated_at: Scalars["DateTime"]["output"];
  user?: Maybe<User>;
  user_id?: Maybe<Scalars["String"]["output"]>;
};

export type PlannerResponse = {
  __typename?: "PlannerResponse";
  info: Info;
  planners: Array<Planner>;
};

/** Estados posibles para una ruta en el planner */
export enum PlannerStatus {
  Completed = "completed",
  Confirmed = "confirmed",
  InProgress = "in_progress",
}

/** Niveles de precio disponibles para los lugares */
export enum PriceLevel {
  High = "high",
  Low = "low",
  Medium = "medium",
}

export type Query = {
  __typename?: "Query";
  activitiesPlanner: ActivitiesPlannerResponse;
  activityPlanner: ActivitiesPlanner;
  allMedia: MediaResponse;
  allplacefeaturecache: Array<Placefeaturecache>;
  categories: Array<Category>;
  category: Category;
  cities: Array<Place>;
  contactDetail?: Maybe<Contact_Detail>;
  currencies: Array<Currency>;
  currency: Currency;
  event: Event;
  events: EventsResponse;
  favorite: Favorite;
  favorites: FavoritesResponse;
  getContactDetails: Array<Contact_Detail>;
  getHello: Scalars["String"]["output"];
  language: Language;
  languages: Array<Language>;
  me?: Maybe<User>;
  media: Media;
  nearbyPlaces: PlacesResponse;
  payment: Payment;
  payments: Array<Payment>;
  paymentsByUser: Array<Payment>;
  place: Place;
  placeActivities: PlaceActivitiesResponse;
  placeActivitiesByPlaceId: PlaceActivitiesResponse;
  placeActivity: PlaceActivity;
  placeAttribute: PlaceAttribute;
  placeAttributes: Array<PlaceAttribute>;
  placeRequest: PlaceRequest;
  placeRequests: PlaceRequestResponse;
  placeTag: PlaceTag;
  placeTags: Array<PlaceTag>;
  placefeaturecache: Placefeaturecache;
  places: PlacesResponse;
  planner: Planner;
  planners: PlannerResponse;
  recommendationLog: RecommendationLog;
  recommendationLogs: RecommendationLogsResponse;
  state: State;
  states: Array<State>;
  tag: Tag;
  tags: Array<Tag>;
  user: User;
  userSession: UserSession;
  userSessions: UserSessionResponse;
  userfeaturescache?: Maybe<Userfeaturescache>;
  userfeaturescacheByUser?: Maybe<Userfeaturescache>;
  userfeaturescaches: UserfeaturescacheResponse;
  users: Array<User>;
};

export type QueryActivitiesPlannerArgs = {
  activities_ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  current?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryActivityPlannerArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryAllMediaArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
  event_id?: InputMaybe<Array<Scalars["String"]["input"]>>;
  isCover?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isRandom?: InputMaybe<Scalars["Boolean"]["input"]>;
  mime_type?: InputMaybe<Array<Scalars["String"]["input"]>>;
  place_id?: InputMaybe<Array<Scalars["String"]["input"]>>;
  seed?: InputMaybe<Scalars["Int"]["input"]>;
  user_id?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueryAllplacefeaturecacheArgs = {
  categoryId?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  stateId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryCategoryArgs = {
  id_category: Scalars["ID"]["input"];
};

export type QueryCitiesArgs = {
  state_id?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryContactDetailArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryCurrencyArgs = {
  id: Scalars["String"]["input"];
};

export type QueryEventArgs = {
  id: Scalars["String"]["input"];
};

export type QueryEventsArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
  end_date?: InputMaybe<Scalars["DateTime"]["input"]>;
  id_category?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_state?: InputMaybe<Array<Scalars["String"]["input"]>>;
  isCover?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  mime_type?: InputMaybe<Array<Scalars["String"]["input"]>>;
  start_date?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryFavoriteArgs = {
  id: Scalars["String"]["input"];
};

export type QueryFavoritesArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryGetContactDetailsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryLanguageArgs = {
  id: Scalars["String"]["input"];
};

export type QueryMediaArgs = {
  id: Scalars["String"]["input"];
};

export type QueryNearbyPlacesArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
  id_category?: InputMaybe<Array<Scalars["String"]["input"]>>;
  isCover?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  latitude: Scalars["Float"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  longitude: Scalars["Float"]["input"];
  mime_type?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  state_id?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueryPaymentArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPlaceArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPlaceActivitiesArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
  isCover?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  mime_type?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueryPlaceActivitiesByPlaceIdArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
  isCover?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  mime_type?: InputMaybe<Array<Scalars["String"]["input"]>>;
  placeId: Scalars["ID"]["input"];
};

export type QueryPlaceActivityArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPlaceAttributeArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPlaceRequestArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPlaceRequestsArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
  state_ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  status?: InputMaybe<Request_Status>;
};

export type QueryPlaceTagArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPlacefeaturecacheArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPlacesArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
  id_category?: InputMaybe<Array<Scalars["String"]["input"]>>;
  isCover?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isRandom?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  mime_type?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  regions?: InputMaybe<Array<ValidRegions>>;
  seed?: InputMaybe<Scalars["Int"]["input"]>;
  state_id?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueryPlannerArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPlannersArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
  status?: InputMaybe<PlannerStatus>;
};

export type QueryRecommendationLogArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryRecommendationLogsArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryStateArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryStatesArgs = {
  name?: InputMaybe<Array<Scalars["String"]["input"]>>;
  regions?: InputMaybe<Array<ValidRegions>>;
};

export type QueryTagArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryUserArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryUserSessionArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryUserSessionsArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
  device_types?: InputMaybe<Array<Device_Types>>;
  user_ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type QueryUserfeaturescacheArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryUserfeaturescacheByUserArgs = {
  userId: Scalars["ID"]["input"];
};

export type QueryUserfeaturescachesArgs = {
  current?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RecommendationLog = {
  __typename?: "RecommendationLog";
  User?: Maybe<User>;
  algorithm_version: Scalars["String"]["output"];
  created_at: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  model_version: Scalars["String"]["output"];
  places_clicked: Scalars["JSON"]["output"];
  places_favorited: Scalars["JSON"]["output"];
  recommended_places: Scalars["JSON"]["output"];
  request_context: Scalars["JSON"]["output"];
  session_id?: Maybe<Scalars["ID"]["output"]>;
  time_to_first_click_seconds: Scalars["Int"]["output"];
  total_engagement_score: Scalars["Float"]["output"];
  user_id?: Maybe<Scalars["ID"]["output"]>;
};

export type RecommendationLogsResponse = {
  __typename?: "RecommendationLogsResponse";
  info: Info;
  recommendationLogs: Array<RecommendationLog>;
};

export type RegisterUserInput = {
  email: Scalars["String"]["input"];
  image?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type RequestHistoryEntry = {
  __typename?: "RequestHistoryEntry";
  /** Update date */
  changed_at: Scalars["DateTime"]["output"];
  /** Changes made in update */
  changes: Array<ChangeElement>;
};

export enum Role {
  Admin = "admin",
  AdminState = "adminState",
  Partner = "partner",
  User = "user",
}

export type State = {
  __typename?: "State";
  created_at: Scalars["DateTime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  extension?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  places?: Maybe<Array<Place>>;
  population?: Maybe<Scalars["Int"]["output"]>;
  region: Scalars["String"]["output"];
  updated_at: Scalars["DateTime"]["output"];
};

export type Tag = {
  __typename?: "Tag";
  created_at?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  tag_category: TagCategory;
  tag_name: Scalars["String"]["output"];
  updated_at?: Maybe<Scalars["DateTime"]["output"]>;
};

/** Categorías disponibles para los tags */
export enum TagCategory {
  Activity = "activity",
  Characteristics = "characteristics",
  Environment = "environment",
  Public = "public",
  Type = "type",
}

/** Tipos de grupos de viaje disponibles para los lugares */
export enum TravelPartyType {
  Business = "business",
  Couple = "couple",
  Family = "family",
  Friends = "friends",
  Solo = "solo",
}

export type UpdateActivitiesPlannerInput = {
  day?: InputMaybe<Scalars["DateTime"]["input"]>;
  id: Scalars["ID"]["input"];
  id_places?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_planner?: InputMaybe<Scalars["ID"]["input"]>;
};

export type UpdateCategoryInput = {
  category?: InputMaybe<Scalars["String"]["input"]>;
  id_category: Scalars["ID"]["input"];
};

export type UpdateCurrencyInput = {
  abbr?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateEventInput = {
  contactDetails_id?: InputMaybe<Scalars["ID"]["input"]>;
  details?: InputMaybe<Scalars["JSON"]["input"]>;
  end_date?: InputMaybe<Scalars["DateTime"]["input"]>;
  id: Scalars["ID"]["input"];
  id_category?: InputMaybe<Scalars["ID"]["input"]>;
  id_state?: InputMaybe<Scalars["ID"]["input"]>;
  isTradition?: InputMaybe<Scalars["Boolean"]["input"]>;
  languages_details?: InputMaybe<Scalars["JSON"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  start_date?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type UpdateLanguageInput = {
  abbr?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateMediaInput = {
  alt_text?: InputMaybe<Scalars["String"]["input"]>;
  event_id?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  isCover?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata?: InputMaybe<Scalars["JSON"]["input"]>;
  mime_type?: InputMaybe<Scalars["String"]["input"]>;
  miniature_url?: InputMaybe<Scalars["String"]["input"]>;
  place_activities_id?: InputMaybe<Scalars["String"]["input"]>;
  place_id?: InputMaybe<Scalars["String"]["input"]>;
  review_id?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<MediaStatus>;
  stream_url?: InputMaybe<Scalars["String"]["input"]>;
  url?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdatePaymentInput = {
  card_number_hashed?: InputMaybe<Scalars["String"]["input"]>;
  cardtype?: InputMaybe<Scalars["String"]["input"]>;
  cvc_hashed?: InputMaybe<Scalars["String"]["input"]>;
  expiry_date_hashed?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  last_4?: InputMaybe<Scalars["String"]["input"]>;
  name_card?: InputMaybe<Scalars["String"]["input"]>;
  surname_card?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type UpdatePlaceActivityInput = {
  activity_name?: InputMaybe<Scalars["String"]["input"]>;
  additional_cost?: InputMaybe<Scalars["Float"]["input"]>;
  available_months?: InputMaybe<Scalars["JSON"]["input"]>;
  difficulty_level?: InputMaybe<DifficultyLevel>;
  id: Scalars["ID"]["input"];
  min_age?: InputMaybe<Scalars["Int"]["input"]>;
  place_id?: InputMaybe<Scalars["ID"]["input"]>;
  requires_equipment?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type UpdatePlaceAttributeInput = {
  accommodation_avg_cost?: InputMaybe<Scalars["Int"]["input"]>;
  avg_temp_summer_celsius?: InputMaybe<Scalars["Float"]["input"]>;
  avg_temp_winter_celsius?: InputMaybe<Scalars["Float"]["input"]>;
  avoid_seasons?: InputMaybe<Scalars["JSON"]["input"]>;
  beach_type?: InputMaybe<BeachType>;
  best_seasons?: InputMaybe<Scalars["JSON"]["input"]>;
  crowd_level?: InputMaybe<CrowdLevel>;
  cuisine_types?: InputMaybe<Scalars["JSON"]["input"]>;
  culinary_speciality?: InputMaybe<Scalars["String"]["input"]>;
  development_level?: InputMaybe<DevelopmentLevel>;
  environment_type?: InputMaybe<EnvironmentType>;
  estimated_daily_cost_max?: InputMaybe<Scalars["Float"]["input"]>;
  estimated_daily_cost_min?: InputMaybe<Scalars["Float"]["input"]>;
  food_avg_cost?: InputMaybe<Scalars["Int"]["input"]>;
  has_gluten_free?: InputMaybe<Scalars["Boolean"]["input"]>;
  has_nightlife?: InputMaybe<Scalars["Boolean"]["input"]>;
  has_parking?: InputMaybe<Scalars["Boolean"]["input"]>;
  has_reef?: InputMaybe<Scalars["Boolean"]["input"]>;
  has_vegan_options?: InputMaybe<Scalars["Boolean"]["input"]>;
  has_vegetarian_options?: InputMaybe<Scalars["Boolean"]["input"]>;
  id: Scalars["ID"]["input"];
  ideal_months?: InputMaybe<Scalars["JSON"]["input"]>;
  is_protected_area?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_pueblo_magico?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_unesco_heritage?: InputMaybe<Scalars["Boolean"]["input"]>;
  municipality?: InputMaybe<Scalars["String"]["input"]>;
  pet_friendly?: InputMaybe<Scalars["Boolean"]["input"]>;
  place_id?: InputMaybe<Scalars["ID"]["input"]>;
  price_level?: InputMaybe<PriceLevel>;
  recommended_days?: InputMaybe<Scalars["Int"]["input"]>;
  requires_guide?: InputMaybe<Scalars["Boolean"]["input"]>;
  requires_permit?: InputMaybe<Scalars["Boolean"]["input"]>;
  sand_color?: InputMaybe<Scalars["String"]["input"]>;
  typical_visit_hours?: InputMaybe<Scalars["Float"]["input"]>;
  verified?: InputMaybe<Scalars["Boolean"]["input"]>;
  verified_at?: InputMaybe<Scalars["DateTime"]["input"]>;
  wave_type?: InputMaybe<WaveType>;
  wheelchair_accessible?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type UpdatePlaceInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  city_id?: InputMaybe<Scalars["ID"]["input"]>;
  contactDetails_id?: InputMaybe<Scalars["ID"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  details?: InputMaybe<Scalars["JSON"]["input"]>;
  id: Scalars["ID"]["input"];
  id_category?: InputMaybe<Scalars["ID"]["input"]>;
  languages_details?: InputMaybe<Scalars["JSON"]["input"]>;
  latitude?: InputMaybe<Scalars["Float"]["input"]>;
  longitude?: InputMaybe<Scalars["Float"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  state_id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type UpdatePlaceRequestInput = {
  id: Scalars["ID"]["input"];
  id_place?: InputMaybe<Scalars["ID"]["input"]>;
  /** If left blank, it will automatically use the authenticated user's ID */
  id_user?: InputMaybe<Scalars["ID"]["input"]>;
  /** Partial info of the place to modify */
  place_json?: InputMaybe<Scalars["JSON"]["input"]>;
  status?: InputMaybe<Request_Status>;
};

export type UpdatePlaceTagInput = {
  id: Scalars["ID"]["input"];
  place_id?: InputMaybe<Scalars["ID"]["input"]>;
  relevance_score?: InputMaybe<Scalars["Float"]["input"]>;
  tag_id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type UpdatePlacefeaturecacheInput = {
  avg_overral_rating?: InputMaybe<Scalars["Float"]["input"]>;
  avg_value_rating?: InputMaybe<Scalars["Float"]["input"]>;
  avg_visitor_age_rate?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  place_id?: InputMaybe<Scalars["String"]["input"]>;
  primary_travel_party_type?: InputMaybe<TravelPartyType>;
  rating_count?: InputMaybe<Scalars["Int"]["input"]>;
  total_bookings?: InputMaybe<Scalars["Int"]["input"]>;
  total_favorites?: InputMaybe<Scalars["Int"]["input"]>;
  total_interactions?: InputMaybe<Scalars["Int"]["input"]>;
  total_reviews?: InputMaybe<Scalars["Int"]["input"]>;
  total_views?: InputMaybe<Scalars["Int"]["input"]>;
  trending_score?: InputMaybe<Scalars["Float"]["input"]>;
  views_last_7_days?: InputMaybe<Scalars["Int"]["input"]>;
  views_last_30_days?: InputMaybe<Scalars["Int"]["input"]>;
};

export type UpdatePlannerInput = {
  budget?: InputMaybe<Scalars["Float"]["input"]>;
  end_date?: InputMaybe<Scalars["DateTime"]["input"]>;
  id: Scalars["String"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  people?: InputMaybe<Scalars["Int"]["input"]>;
  start_date?: InputMaybe<Scalars["DateTime"]["input"]>;
  state_id?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Routes_Status>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateStateInput = {
  created_at?: InputMaybe<Scalars["DateTime"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  extension?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  population?: InputMaybe<Scalars["Int"]["input"]>;
  region?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type UpdateTagInput = {
  id: Scalars["String"]["input"];
  tag_category?: InputMaybe<TagCategory>;
  tag_name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  id_currency?: InputMaybe<Scalars["ID"]["input"]>;
  id_language?: InputMaybe<Scalars["ID"]["input"]>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  managedStateId?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  password?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Role>;
};

export type UpdateUserSessionInput = {
  browser?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  device_os?: InputMaybe<Scalars["String"]["input"]>;
  /** Device session type (mobile | desktop) */
  device_type?: InputMaybe<Device_Types>;
  duration_seconds?: InputMaybe<Scalars["Int"]["input"]>;
  ended_at?: InputMaybe<Scalars["DateTime"]["input"]>;
  had_favorite?: InputMaybe<Scalars["Boolean"]["input"]>;
  had_interaction?: InputMaybe<Scalars["Boolean"]["input"]>;
  id: Scalars["ID"]["input"];
  ip_address?: InputMaybe<Scalars["String"]["input"]>;
  page_views?: InputMaybe<Scalars["Int"]["input"]>;
  started_at?: InputMaybe<Scalars["DateTime"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type User = {
  __typename?: "User";
  createdAt: Scalars["DateTime"]["output"];
  currencies?: Maybe<Currency>;
  email: Scalars["String"]["output"];
  emailVerified?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["ID"]["output"];
  id_currency?: Maybe<Scalars["ID"]["output"]>;
  id_language?: Maybe<Scalars["ID"]["output"]>;
  image?: Maybe<Scalars["String"]["output"]>;
  languages?: Maybe<Language>;
  managedStateId?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  payments?: Maybe<Array<Payment>>;
  role?: Maybe<Role>;
  updatedAt: Scalars["DateTime"]["output"];
  userFeaturesCache?: Maybe<Userfeaturescache>;
};

export type UserSession = {
  __typename?: "UserSession";
  RecommendationLogs?: Maybe<Array<RecommendationLog>>;
  browser: Scalars["String"]["output"];
  city: Scalars["String"]["output"];
  country: Scalars["String"]["output"];
  device_os: Scalars["String"]["output"];
  device_type: Device_Types;
  duration_seconds: Scalars["Int"]["output"];
  ended_at: Scalars["DateTime"]["output"];
  had_favorite: Scalars["Boolean"]["output"];
  had_interaction: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  ip_address: Scalars["String"]["output"];
  page_views: Scalars["Int"]["output"];
  started_at: Scalars["DateTime"]["output"];
  state: Scalars["String"]["output"];
  user?: Maybe<User>;
  user_id?: Maybe<Scalars["ID"]["output"]>;
};

export type UserSessionResponse = {
  __typename?: "UserSessionResponse";
  info: Info;
  user_sessions: Array<UserSession>;
};

export type Userfeaturescache = {
  __typename?: "Userfeaturescache";
  User?: Maybe<User>;
  adventure_level_score: Scalars["Float"]["output"];
  avg_daily_cost_preference: Scalars["Int"]["output"];
  avg_price_level_interacted: Scalars["String"]["output"];
  avg_session_duration_seconds: Scalars["Int"]["output"];
  beach_preference_score: Scalars["Float"]["output"];
  booking_conversation_ratio: Scalars["Float"]["output"];
  created_at: Scalars["DateTime"]["output"];
  cultural_interest_score: Scalars["Float"]["output"];
  favorite_ratio: Scalars["Float"]["output"];
  id: Scalars["ID"]["output"];
  last_interaction_at: Scalars["DateTime"]["output"];
  nightlife_interest_score: Scalars["Float"]["output"];
  top_activities: Scalars["JSON"]["output"];
  top_categories: Scalars["JSON"]["output"];
  top_states: Scalars["JSON"]["output"];
  total_booking?: Maybe<Scalars["Int"]["output"]>;
  total_favorites?: Maybe<Scalars["Int"]["output"]>;
  total_interactions?: Maybe<Scalars["Int"]["output"]>;
  total_views?: Maybe<Scalars["Int"]["output"]>;
  updated_at: Scalars["DateTime"]["output"];
  user_id?: Maybe<Scalars["ID"]["output"]>;
};

export type UserfeaturescacheResponse = {
  __typename?: "UserfeaturescacheResponse";
  info: Info;
  userfeaturescaches: Array<Userfeaturescache>;
};

export enum ValidRegions {
  Bajio = "Bajio",
  Caribe = "Caribe",
  Centro = "Centro",
  Norte = "Norte",
  Pacifico = "Pacifico",
}

/** Tipos de olas disponibles para los lugares */
export enum WaveType {
  Calm = "calm",
  Moderate = "moderate",
  Na = "na",
  Strong = "strong",
}

export enum Device_Types {
  Desktop = "desktop",
  Mobile = "mobile",
}

export enum Request_Status {
  Approved = "approved",
  Pending = "pending",
  Rejected = "rejected",
}

/** Estados posibles para una ruta en el planner */
export enum Routes_Status {
  Completed = "completed",
  Confirmed = "confirmed",
  InProgress = "in_progress",
}

export type GetEventsByCategoryQueryVariables = Exact<{
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
}>;

export type GetEventsByCategoryQuery = {
  __typename?: "Query";
  events: {
    __typename?: "EventsResponse";
    events: Array<{
      __typename?: "Event";
      id: string;
      name: string;
      start_date: any;
      end_date: any;
    }>;
  };
};

export type GetNextCulturalEventsQueryVariables = Exact<{
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  current?: InputMaybe<Scalars["Int"]["input"]>;
  startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
}>;

export type GetNextCulturalEventsQuery = {
  __typename?: "Query";
  events: {
    __typename?: "EventsResponse";
    events: Array<{
      __typename?: "Event";
      id: string;
      name: string;
      start_date: any;
      end_date: any;
      state?: { __typename?: "State"; name: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
    }>;
    info: {
      __typename?: "Info";
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetFeedVideosQueryVariables = Exact<{
  current?: InputMaybe<Scalars["Int"]["input"]>;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isRandom?: InputMaybe<Scalars["Boolean"]["input"]>;
  seed?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetFeedVideosQuery = {
  __typename?: "Query";
  allMedia: {
    __typename?: "MediaResponse";
    media: Array<{
      __typename?: "Media";
      url: string;
      id: string;
      miniature_url?: string | null;
      stream_url?: string | null;
      place?: {
        __typename?: "Place";
        id: string;
        name: string;
        description?: string | null;
      } | null;
    }>;
    info: {
      __typename?: "Info";
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type GetCategoriesQuery = {
  __typename?: "Query";
  categories: Array<{
    __typename?: "Category";
    id_category: string;
    category: string;
  }>;
};

export type GetAllCitiesQueryVariables = Exact<{
  current?: InputMaybe<Scalars["Int"]["input"]>;
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  regions?: InputMaybe<Array<ValidRegions> | ValidRegions>;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  isRandom?: InputMaybe<Scalars["Boolean"]["input"]>;
  seed?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetAllCitiesQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      state?: { __typename?: "State"; name: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
    }>;
    info: {
      __typename?: "Info";
      count: number;
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetAllEventsByPlacesQueryVariables = Exact<{
  startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
}>;

export type GetAllEventsByPlacesQuery = {
  __typename?: "Query";
  events: {
    __typename?: "EventsResponse";
    events: Array<{
      __typename?: "Event";
      id: string;
      name: string;
      start_date: any;
      end_date: any;
      state?: { __typename?: "State"; name: string } | null;
      category?: { __typename?: "Category"; category: string } | null;
    }>;
  };
};

export type GetAllNearbyMagicalTownsQueryVariables = Exact<{
  latitude: Scalars["Float"]["input"];
  longitude: Scalars["Float"]["input"];
  current?: InputMaybe<Scalars["Int"]["input"]>;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
}>;

export type GetAllNearbyMagicalTownsQuery = {
  __typename?: "Query";
  nearbyPlaces: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      latitude?: number | null;
      longitude?: number | null;
      category?: { __typename?: "Category"; category: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
      state?: { __typename?: "State"; name: string } | null;
    }>;
    info: {
      __typename?: "Info";
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetAllNearbyPlacesQueryVariables = Exact<{
  latitude: Scalars["Float"]["input"];
  longitude: Scalars["Float"]["input"];
  current?: InputMaybe<Scalars["Int"]["input"]>;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
}>;

export type GetAllNearbyPlacesQuery = {
  __typename?: "Query";
  nearbyPlaces: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      latitude?: number | null;
      longitude?: number | null;
      category?: { __typename?: "Category"; category: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
      state?: { __typename?: "State"; name: string } | null;
    }>;
    info: {
      __typename?: "Info";
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetAllPlacesByCategoryQueryVariables = Exact<{
  current?: InputMaybe<Scalars["Int"]["input"]>;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isRandom?: InputMaybe<Scalars["Boolean"]["input"]>;
  seed?: InputMaybe<Scalars["Int"]["input"]>;
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetAllPlacesByCategoryQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      state?: { __typename?: "State"; name: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
      category?: { __typename?: "Category"; category: string } | null;
    }>;
    info: {
      __typename?: "Info";
      count: number;
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetAllPlacesByStateQueryVariables = Exact<{
  current?: InputMaybe<Scalars["Int"]["input"]>;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isRandom?: InputMaybe<Scalars["Boolean"]["input"]>;
  seed?: InputMaybe<Scalars["Int"]["input"]>;
  stateId?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
}>;

export type GetAllPlacesByStateQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      state?: { __typename?: "State"; id: string; name: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
      category?: { __typename?: "Category"; category: string } | null;
    }>;
    info: {
      __typename?: "Info";
      count: number;
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetAllPlacesQueryVariables = Exact<{
  current?: InputMaybe<Scalars["Int"]["input"]>;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isRandom?: InputMaybe<Scalars["Boolean"]["input"]>;
  seed?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetAllPlacesQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      state?: { __typename?: "State"; name: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
      category?: { __typename?: "Category"; category: string } | null;
    }>;
    info: {
      __typename?: "Info";
      count: number;
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetCitiesQueryVariables = Exact<{
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  regions?: InputMaybe<Array<ValidRegions> | ValidRegions>;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetCitiesQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      name: string;
      id: string;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
    }>;
  };
};

export type GetMostPopularMagicalTownQueryVariables = Exact<{
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
}>;

export type GetMostPopularMagicalTownQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      state?: { __typename?: "State"; name: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
    }>;
  };
};

export type GetMostPopularPlacesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
}>;

export type GetMostPopularPlacesQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
      state?: { __typename?: "State"; name: string } | null;
    }>;
  };
};

export type GetNearbyCulturalPlacesQueryVariables = Exact<{
  latitude: Scalars["Float"]["input"];
  longitude: Scalars["Float"]["input"];
  current?: InputMaybe<Scalars["Int"]["input"]>;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetNearbyCulturalPlacesQuery = {
  __typename?: "Query";
  nearbyPlaces: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      latitude?: number | null;
      longitude?: number | null;
      category?: { __typename?: "Category"; category: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
      state?: { __typename?: "State"; name: string } | null;
    }>;
    info: {
      __typename?: "Info";
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetNearbyFoodPlacesQueryVariables = Exact<{
  latitude: Scalars["Float"]["input"];
  longitude: Scalars["Float"]["input"];
  current?: InputMaybe<Scalars["Int"]["input"]>;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetNearbyFoodPlacesQuery = {
  __typename?: "Query";
  nearbyPlaces: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      latitude?: number | null;
      longitude?: number | null;
      category?: { __typename?: "Category"; category: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
      state?: { __typename?: "State"; name: string } | null;
    }>;
    info: {
      __typename?: "Info";
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetNearbyNaturePlacesQueryVariables = Exact<{
  latitude: Scalars["Float"]["input"];
  longitude: Scalars["Float"]["input"];
  current?: InputMaybe<Scalars["Int"]["input"]>;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetNearbyNaturePlacesQuery = {
  __typename?: "Query";
  nearbyPlaces: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      latitude?: number | null;
      longitude?: number | null;
      category?: { __typename?: "Category"; category: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
      state?: { __typename?: "State"; name: string } | null;
    }>;
    info: {
      __typename?: "Info";
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type PlaceActivitiesByPlaceIdQueryVariables = Exact<{
  placeId: Scalars["ID"]["input"];
  current?: InputMaybe<Scalars["Int"]["input"]>;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
}>;

export type PlaceActivitiesByPlaceIdQuery = {
  __typename?: "Query";
  placeActivitiesByPlaceId: {
    __typename?: "PlaceActivitiesResponse";
    info: {
      __typename?: "Info";
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
    placeActivities: Array<{
      __typename?: "PlaceActivity";
      id: string;
      activity_name: string;
      difficulty_level: DifficultyLevel;
      additional_cost: number;
      requires_equipment: boolean;
      min_age: number;
      available_months: any;
      place_id?: string | null;
      media?: Array<{ __typename?: "Media"; url: string }> | null;
    }>;
  };
};

export type GetPlaceByIdQueryVariables = Exact<{
  placeId: Scalars["String"]["input"];
}>;

export type GetPlaceByIdQuery = {
  __typename?: "Query";
  place: {
    __typename?: "Place";
    name: string;
    description?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    address?: string | null;
    details?: any | null;
    category?: { __typename?: "Category"; category: string } | null;
    placeAttributes?: {
      __typename?: "PlaceAttribute";
      is_pueblo_magico: boolean;
      is_unesco_heritage: boolean;
      is_protected_area: boolean;
      wheelchair_accessible: boolean;
      pet_friendly: boolean;
      has_parking: boolean;
      crowd_level: CrowdLevel;
      price_level: PriceLevel;
      typical_visit_hours?: number | null;
      recommended_days?: number | null;
      best_seasons: any;
      avoid_seasons: any;
      ideal_months: any;
      requires_permit: boolean;
      requires_guide: boolean;
      estimated_daily_cost_min?: number | null;
      estimated_daily_cost_max?: number | null;
      accommodation_avg_cost: number;
      avg_temp_winter_celsius: number;
      avg_temp_summer_celsius: number;
      has_vegan_options: boolean;
      has_vegetarian_options: boolean;
      has_gluten_free: boolean;
      cuisine_types: any;
      culinary_speciality?: string | null;
      food_avg_cost: number;
      beach_type: BeachType;
      sand_color: string;
      wave_type: WaveType;
      has_reef: boolean;
      environment_type: EnvironmentType;
      development_level: DevelopmentLevel;
      has_nightlife: boolean;
    } | null;
  };
};

export type GetPlaceMediaQueryVariables = Exact<{
  placeId?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
}>;

export type GetPlaceMediaQuery = {
  __typename?: "Query";
  allMedia: {
    __typename?: "MediaResponse";
    media: Array<{ __typename?: "Media"; id: string; url: string }>;
  };
};

export type GetPlaceVideosQueryVariables = Exact<{
  placeId?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  current?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetPlaceVideosQuery = {
  __typename?: "Query";
  allMedia: {
    __typename?: "MediaResponse";
    media: Array<{
      __typename?: "Media";
      id: string;
      mime_type: string;
      url: string;
      miniature_url?: string | null;
      stream_url?: string | null;
    }>;
    info: {
      __typename?: "Info";
      count: number;
      next?: number | null;
      pages: number;
      prev?: number | null;
    };
  };
};

export type GetMagicalTownsQueryVariables = Exact<{
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  stateId?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  idCategory?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
}>;

export type GetMagicalTownsQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
    }>;
  };
};

export type GetTopPlacesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  isCover?: InputMaybe<
    Array<Scalars["Boolean"]["input"]> | Scalars["Boolean"]["input"]
  >;
  mimeType?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
}>;

export type GetTopPlacesQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      name: string;
      id: string;
      state?: { __typename?: "State"; name: string } | null;
      medias?: Array<{ __typename?: "Media"; url: string }> | null;
    }>;
  };
};

export type GetAllStatesQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllStatesQuery = {
  __typename?: "Query";
  states: Array<{
    __typename?: "State";
    id: string;
    name: string;
    description?: string | null;
  }>;
};

export type GetAllPlacesByNameQueryVariables = Exact<{
  name?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GetAllPlacesByNameQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesResponse";
    places: Array<{
      __typename?: "Place";
      id: string;
      name: string;
      category?: { __typename?: "Category"; category: string } | null;
    }>;
  };
};

export const GetEventsByCategoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getEventsByCategory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "events" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "events" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "start_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "end_date" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetEventsByCategoryQuery,
  GetEventsByCategoryQueryVariables
>;
export const GetNextCulturalEventsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getNextCulturalEvents" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "limit" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "startDate" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "DateTime" },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "events" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "limit" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "start_date" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "startDate" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "events" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "start_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "end_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetNextCulturalEventsQuery,
  GetNextCulturalEventsQueryVariables
>;
export const GetFeedVideosDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetFeedVideos" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isRandom" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "seed" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "allMedia" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isRandom" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isRandom" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "seed" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "seed" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "media" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "url" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "miniature_url" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "stream_url" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "place" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "description" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetFeedVideosQuery, GetFeedVideosQueryVariables>;
export const GetCategoriesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getCategories" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "categories" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id_category" } },
                { kind: "Field", name: { kind: "Name", value: "category" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetAllCitiesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetAllCities" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "regions" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "ValidRegions" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isRandom" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "seed" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "places" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "regions" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "regions" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isRandom" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isRandom" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "seed" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "seed" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAllCitiesQuery, GetAllCitiesQueryVariables>;
export const GetAllEventsByPlacesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetAllEventsByPlaces" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "startDate" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "DateTime" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "events" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "start_date" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "startDate" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "events" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "start_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "end_date" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "category" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAllEventsByPlacesQuery,
  GetAllEventsByPlacesQueryVariables
>;
export const GetAllNearbyMagicalTownsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getAllNearbyMagicalTowns" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "latitude" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "longitude" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "nearbyPlaces" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "latitude" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "latitude" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "longitude" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "longitude" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "latitude" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "longitude" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "category" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAllNearbyMagicalTownsQuery,
  GetAllNearbyMagicalTownsQueryVariables
>;
export const GetAllNearbyPlacesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getAllNearbyPlaces" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "latitude" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "longitude" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "nearbyPlaces" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "latitude" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "latitude" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "longitude" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "longitude" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "latitude" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "longitude" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "category" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAllNearbyPlacesQuery,
  GetAllNearbyPlacesQueryVariables
>;
export const GetAllPlacesByCategoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetAllPlacesByCategory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isRandom" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "seed" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "limit" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "places" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isRandom" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isRandom" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "seed" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "seed" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "limit" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "category" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAllPlacesByCategoryQuery,
  GetAllPlacesByCategoryQueryVariables
>;
export const GetAllPlacesByStateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetAllPlacesByState" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isRandom" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "seed" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "stateId" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "places" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isRandom" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isRandom" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "seed" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "seed" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "state_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "stateId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "category" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAllPlacesByStateQuery,
  GetAllPlacesByStateQueryVariables
>;
export const GetAllPlacesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetAllPlaces" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isRandom" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "seed" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "places" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isRandom" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isRandom" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "seed" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "seed" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "category" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAllPlacesQuery, GetAllPlacesQueryVariables>;
export const GetCitiesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getCities" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "regions" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "ValidRegions" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "limit" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "places" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "regions" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "regions" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "limit" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCitiesQuery, GetCitiesQueryVariables>;
export const GetMostPopularMagicalTownDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getMostPopularMagicalTown" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "limit" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "places" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "limit" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetMostPopularMagicalTownQuery,
  GetMostPopularMagicalTownQueryVariables
>;
export const GetMostPopularPlacesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetMostPopularPlaces" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "limit" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "places" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "limit" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetMostPopularPlacesQuery,
  GetMostPopularPlacesQueryVariables
>;
export const GetNearbyCulturalPlacesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getNearbyCulturalPlaces" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "latitude" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "longitude" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "limit" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "nearbyPlaces" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "latitude" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "latitude" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "longitude" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "longitude" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "limit" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "latitude" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "longitude" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "category" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetNearbyCulturalPlacesQuery,
  GetNearbyCulturalPlacesQueryVariables
>;
export const GetNearbyFoodPlacesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getNearbyFoodPlaces" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "latitude" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "longitude" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "limit" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "nearbyPlaces" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "latitude" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "latitude" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "longitude" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "longitude" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "limit" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "latitude" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "longitude" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "category" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetNearbyFoodPlacesQuery,
  GetNearbyFoodPlacesQueryVariables
>;
export const GetNearbyNaturePlacesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getNearbyNaturePlaces" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "latitude" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "longitude" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "limit" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "nearbyPlaces" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "latitude" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "latitude" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "longitude" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "longitude" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "limit" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "latitude" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "longitude" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "category" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetNearbyNaturePlacesQuery,
  GetNearbyNaturePlacesQueryVariables
>;
export const PlaceActivitiesByPlaceIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "PlaceActivitiesByPlaceId" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "placeId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "placeActivitiesByPlaceId" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "placeId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "placeId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "placeActivities" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "activity_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "difficulty_level" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "additional_cost" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "requires_equipment" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "min_age" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "available_months" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "place_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "media" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PlaceActivitiesByPlaceIdQuery,
  PlaceActivitiesByPlaceIdQueryVariables
>;
export const GetPlaceByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPlaceById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "placeId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "place" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "placeId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "latitude" } },
                { kind: "Field", name: { kind: "Name", value: "longitude" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "details" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "category" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "placeAttributes" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "is_pueblo_magico" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "is_unesco_heritage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "is_protected_area" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "wheelchair_accessible" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "pet_friendly" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "has_parking" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "crowd_level" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "price_level" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "typical_visit_hours" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "recommended_days" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "best_seasons" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "avoid_seasons" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "ideal_months" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "requires_permit" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "requires_guide" },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "estimated_daily_cost_min",
                        },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "estimated_daily_cost_max",
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "accommodation_avg_cost" },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "avg_temp_winter_celsius",
                        },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "avg_temp_summer_celsius",
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "has_vegan_options" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "has_vegetarian_options" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "has_gluten_free" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "cuisine_types" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "culinary_speciality" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "food_avg_cost" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "beach_type" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "sand_color" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "wave_type" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "has_reef" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "environment_type" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "development_level" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "has_nightlife" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPlaceByIdQuery, GetPlaceByIdQueryVariables>;
export const GetPlaceMediaDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getPlaceMedia" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "placeId" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "allMedia" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "place_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "placeId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "media" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "url" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPlaceMediaQuery, GetPlaceMediaQueryVariables>;
export const GetPlaceVideosDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPlaceVideos" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "placeId" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "allMedia" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "place_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "placeId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "current" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "current" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "media" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mime_type" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "url" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "miniature_url" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "stream_url" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPlaceVideosQuery, GetPlaceVideosQueryVariables>;
export const GetMagicalTownsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getMagicalTowns" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "stateId" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "idCategory" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "places" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "state_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "stateId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "id_category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "idCategory" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetMagicalTownsQuery,
  GetMagicalTownsQueryVariables
>;
export const GetTopPlacesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getTopPlaces" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "limit" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isCover" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Boolean" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "mimeType" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "places" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "limit" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isCover" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isCover" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "mime_type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "mimeType" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "medias" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "url" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTopPlacesQuery, GetTopPlacesQueryVariables>;
export const GetAllStatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getAllStates" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "states" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAllStatesQuery, GetAllStatesQueryVariables>;
export const GetAllPlacesByNameDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getAllPlacesByName" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "places" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "places" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "category" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAllPlacesByNameQuery,
  GetAllPlacesByNameQueryVariables
>;
