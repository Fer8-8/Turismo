// biome-ignore-all lint: auto-generated files

import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "\n  query getEventsByCategory($idCategory: [String!]) {\n    events(id_category: $idCategory) {\n      events {\n        id\n        name\n        start_date\n        end_date\n      }\n    }\n  }\n": typeof types.GetEventsByCategoryDocument;
  "\n  query getNextCulturalEvents($isCover: [Boolean!], $mimeType: [String!], $limit: Int, $current: Int, $startDate: DateTime, $idCategory: [String!]) {\n    events(isCover: $isCover, mime_type: $mimeType, limit: $limit, current: $current, start_date: $startDate, id_category: $idCategory) {\n      events {\n        id\n        name\n        start_date\n        end_date\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n": typeof types.GetNextCulturalEventsDocument;
  "\n  query GetFeedVideos($current: Int, $mimeType: [String!], $isRandom: Boolean, $seed: Int) {\n    allMedia(current: $current, mime_type: $mimeType, isRandom: $isRandom, seed: $seed) {\n      media {\n        url\n        id\n        miniature_url\n        stream_url\n        place {\n          id\n          name\n          description\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n": typeof types.GetFeedVideosDocument;
  "\n  query getCategories {\n    categories {\n      id_category\n      category\n    }\n  }\n": typeof types.GetCategoriesDocument;
  "\n  query GetAllCities($current: Int, $idCategory: [String!], $regions: [ValidRegions!], $mimeType: [String!], $isCover: [Boolean!], $isRandom: Boolean, $seed: Int) {\n    places(current: $current, id_category: $idCategory, regions: $regions, mime_type: $mimeType, isCover: $isCover, isRandom: $isRandom, seed: $seed) {\n      places {\n        id\n        name\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n      info {\n        count\n        next\n        pages\n        prev\n      }\n    }\n  }\n": typeof types.GetAllCitiesDocument;
  "\n  query GetAllEventsByPlaces($startDate: DateTime) {\n    events(start_date: $startDate) {\n      events {\n        id\n        name\n        start_date\n        end_date\n        state {\n          name\n        }\n        category {\n          category\n        }\n      }\n    }\n  }\n": typeof types.GetAllEventsByPlacesDocument;
  "\n  query getAllNearbyMagicalTowns($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!]) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n": typeof types.GetAllNearbyMagicalTownsDocument;
  "\n  query getAllNearbyPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!]) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n": typeof types.GetAllNearbyPlacesDocument;
  "\n  query GetAllPlacesByCategory($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int, $idCategory: [String!], $limit: Int) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed, id_category: $idCategory, limit: $limit) {\n    places {\n      id\n      name\n      state {\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n": typeof types.GetAllPlacesByCategoryDocument;
  "\n  query GetAllPlacesByState($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int, $stateId: [String!]) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed, state_id: $stateId) {\n    places {\n      id\n      name\n      state {\n        id\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n": typeof types.GetAllPlacesByStateDocument;
  "\n  query GetAllPlaces($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed) {\n    places {\n      id\n      name\n      state {\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n": typeof types.GetAllPlacesDocument;
  "\n  query getCities($idCategory: [String!], $regions: [ValidRegions!], $mimeType: [String!], $isCover: [Boolean!], $limit: Int) {\n    places(id_category: $idCategory, regions: $regions, mime_type: $mimeType, isCover: $isCover, limit: $limit) {\n      places {\n        name\n        id\n        medias {\n          url\n        }\n      }\n    }\n  }\n": typeof types.GetCitiesDocument;
  "\n  query getMostPopularMagicalTown($idCategory: [String!], $limit: Int, $isCover: [Boolean!]) {\n    places(id_category: $idCategory, limit: $limit, isCover: $isCover) {\n      places {\n        id\n        name\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n    }\n  }\n": typeof types.GetMostPopularMagicalTownDocument;
  "\n  query GetMostPopularPlaces($limit: Int, $isCover: [Boolean!]) {\n    places(limit: $limit, isCover: $isCover) {\n      places {\n        id\n        name\n        medias {\n          url\n        }\n        state {\n          name\n        }\n      }\n    }\n  }\n": typeof types.GetMostPopularPlacesDocument;
  "\n  query getNearbyCulturalPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n": typeof types.GetNearbyCulturalPlacesDocument;
  "\n  query getNearbyFoodPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n": typeof types.GetNearbyFoodPlacesDocument;
  "\n  query getNearbyNaturePlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n": typeof types.GetNearbyNaturePlacesDocument;
  "\n  query PlaceActivitiesByPlaceId($placeId: ID!, $current: Int, $mimeType: [String!], $isCover: [Boolean!]) {\n    placeActivitiesByPlaceId(placeId: $placeId, current: $current, mime_type: $mimeType, isCover: $isCover) {\n      info {\n        next\n        pages\n        prev\n      }\n      placeActivities {\n        id\n        activity_name\n        difficulty_level\n        additional_cost\n        requires_equipment\n        min_age\n        available_months\n        place_id\n        media {\n          url\n        }\n      }\n    }\n  }\n": typeof types.PlaceActivitiesByPlaceIdDocument;
  "\n  query GetPlaceById($placeId: String!) {\n    place(id: $placeId) {\n      name\n      description\n      latitude\n      longitude\n      address\n      details\n      category {\n        category\n      }\n      placeAttributes {\n        is_pueblo_magico\n        is_unesco_heritage\n        is_protected_area\n        wheelchair_accessible\n        pet_friendly\n        has_parking\n        crowd_level\n        price_level\n        typical_visit_hours\n        recommended_days\n        best_seasons\n        avoid_seasons\n        ideal_months\n        requires_permit\n        requires_guide\n        estimated_daily_cost_min\n        estimated_daily_cost_max\n        accommodation_avg_cost\n        avg_temp_winter_celsius\n        avg_temp_summer_celsius\n        has_vegan_options\n        has_vegetarian_options\n        has_gluten_free\n        cuisine_types\n        culinary_speciality\n        food_avg_cost\n        beach_type\n        sand_color\n        wave_type\n        has_reef\n        environment_type\n        development_level\n        has_nightlife\n      }\n    }\n  }\n": typeof types.GetPlaceByIdDocument;
  "\n  query getPlaceMedia($placeId: [String!], $mimeType: [String!]) {\n    allMedia(place_id: $placeId, mime_type: $mimeType) {\n      media {\n        id\n        url\n      }\n    }\n  }\n": typeof types.GetPlaceMediaDocument;
  "\n  query GetPlaceVideos($placeId: [String!], $current: Int) {\n    allMedia(place_id: $placeId, current: $current) {\n      media {\n        id\n        mime_type\n        url\n        miniature_url\n        stream_url\n      }\n      info {\n        count\n        next\n        pages\n        prev\n      }\n    }\n  }\n": typeof types.GetPlaceVideosDocument;
  "\n    query getMagicalTowns($isCover: [Boolean!], $stateId: [String!], $idCategory: [String!]) {\n  places(isCover: $isCover, state_id: $stateId, id_category: $idCategory) {\n    places {\n      id\n      name\n      medias {\n        url\n      }\n    }\n  }\n}\n  ": typeof types.GetMagicalTownsDocument;
  "\n    query getTopPlaces($limit: Int, $isCover: [Boolean!], $mimeType: [String!]) {\n  places(limit: $limit, isCover: $isCover, mime_type: $mimeType) {\n    places {\n      name\n      state {\n        name\n      }\n      id\n      medias {\n        url\n      }\n    }\n  }\n}\n": typeof types.GetTopPlacesDocument;
  "\n  query getAllStates {\n      states {\n        id\n        name\n        description\n      }\n  }\n": typeof types.GetAllStatesDocument;
  "\n  query getAllPlacesByName($name: String) {\n    places(name: $name) {\n      places {\n        id\n        name\n        category {\n          category\n        }\n      }\n    }\n  }\n": typeof types.GetAllPlacesByNameDocument;
};
const documents: Documents = {
  "\n  query getEventsByCategory($idCategory: [String!]) {\n    events(id_category: $idCategory) {\n      events {\n        id\n        name\n        start_date\n        end_date\n      }\n    }\n  }\n":
    types.GetEventsByCategoryDocument,
  "\n  query getNextCulturalEvents($isCover: [Boolean!], $mimeType: [String!], $limit: Int, $current: Int, $startDate: DateTime, $idCategory: [String!]) {\n    events(isCover: $isCover, mime_type: $mimeType, limit: $limit, current: $current, start_date: $startDate, id_category: $idCategory) {\n      events {\n        id\n        name\n        start_date\n        end_date\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n":
    types.GetNextCulturalEventsDocument,
  "\n  query GetFeedVideos($current: Int, $mimeType: [String!], $isRandom: Boolean, $seed: Int) {\n    allMedia(current: $current, mime_type: $mimeType, isRandom: $isRandom, seed: $seed) {\n      media {\n        url\n        id\n        miniature_url\n        stream_url\n        place {\n          id\n          name\n          description\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n":
    types.GetFeedVideosDocument,
  "\n  query getCategories {\n    categories {\n      id_category\n      category\n    }\n  }\n":
    types.GetCategoriesDocument,
  "\n  query GetAllCities($current: Int, $idCategory: [String!], $regions: [ValidRegions!], $mimeType: [String!], $isCover: [Boolean!], $isRandom: Boolean, $seed: Int) {\n    places(current: $current, id_category: $idCategory, regions: $regions, mime_type: $mimeType, isCover: $isCover, isRandom: $isRandom, seed: $seed) {\n      places {\n        id\n        name\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n      info {\n        count\n        next\n        pages\n        prev\n      }\n    }\n  }\n":
    types.GetAllCitiesDocument,
  "\n  query GetAllEventsByPlaces($startDate: DateTime) {\n    events(start_date: $startDate) {\n      events {\n        id\n        name\n        start_date\n        end_date\n        state {\n          name\n        }\n        category {\n          category\n        }\n      }\n    }\n  }\n":
    types.GetAllEventsByPlacesDocument,
  "\n  query getAllNearbyMagicalTowns($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!]) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n":
    types.GetAllNearbyMagicalTownsDocument,
  "\n  query getAllNearbyPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!]) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n":
    types.GetAllNearbyPlacesDocument,
  "\n  query GetAllPlacesByCategory($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int, $idCategory: [String!], $limit: Int) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed, id_category: $idCategory, limit: $limit) {\n    places {\n      id\n      name\n      state {\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n":
    types.GetAllPlacesByCategoryDocument,
  "\n  query GetAllPlacesByState($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int, $stateId: [String!]) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed, state_id: $stateId) {\n    places {\n      id\n      name\n      state {\n        id\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n":
    types.GetAllPlacesByStateDocument,
  "\n  query GetAllPlaces($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed) {\n    places {\n      id\n      name\n      state {\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n":
    types.GetAllPlacesDocument,
  "\n  query getCities($idCategory: [String!], $regions: [ValidRegions!], $mimeType: [String!], $isCover: [Boolean!], $limit: Int) {\n    places(id_category: $idCategory, regions: $regions, mime_type: $mimeType, isCover: $isCover, limit: $limit) {\n      places {\n        name\n        id\n        medias {\n          url\n        }\n      }\n    }\n  }\n":
    types.GetCitiesDocument,
  "\n  query getMostPopularMagicalTown($idCategory: [String!], $limit: Int, $isCover: [Boolean!]) {\n    places(id_category: $idCategory, limit: $limit, isCover: $isCover) {\n      places {\n        id\n        name\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n    }\n  }\n":
    types.GetMostPopularMagicalTownDocument,
  "\n  query GetMostPopularPlaces($limit: Int, $isCover: [Boolean!]) {\n    places(limit: $limit, isCover: $isCover) {\n      places {\n        id\n        name\n        medias {\n          url\n        }\n        state {\n          name\n        }\n      }\n    }\n  }\n":
    types.GetMostPopularPlacesDocument,
  "\n  query getNearbyCulturalPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n":
    types.GetNearbyCulturalPlacesDocument,
  "\n  query getNearbyFoodPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n":
    types.GetNearbyFoodPlacesDocument,
  "\n  query getNearbyNaturePlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n":
    types.GetNearbyNaturePlacesDocument,
  "\n  query PlaceActivitiesByPlaceId($placeId: ID!, $current: Int, $mimeType: [String!], $isCover: [Boolean!]) {\n    placeActivitiesByPlaceId(placeId: $placeId, current: $current, mime_type: $mimeType, isCover: $isCover) {\n      info {\n        next\n        pages\n        prev\n      }\n      placeActivities {\n        id\n        activity_name\n        difficulty_level\n        additional_cost\n        requires_equipment\n        min_age\n        available_months\n        place_id\n        media {\n          url\n        }\n      }\n    }\n  }\n":
    types.PlaceActivitiesByPlaceIdDocument,
  "\n  query GetPlaceById($placeId: String!) {\n    place(id: $placeId) {\n      name\n      description\n      latitude\n      longitude\n      address\n      details\n      category {\n        category\n      }\n      placeAttributes {\n        is_pueblo_magico\n        is_unesco_heritage\n        is_protected_area\n        wheelchair_accessible\n        pet_friendly\n        has_parking\n        crowd_level\n        price_level\n        typical_visit_hours\n        recommended_days\n        best_seasons\n        avoid_seasons\n        ideal_months\n        requires_permit\n        requires_guide\n        estimated_daily_cost_min\n        estimated_daily_cost_max\n        accommodation_avg_cost\n        avg_temp_winter_celsius\n        avg_temp_summer_celsius\n        has_vegan_options\n        has_vegetarian_options\n        has_gluten_free\n        cuisine_types\n        culinary_speciality\n        food_avg_cost\n        beach_type\n        sand_color\n        wave_type\n        has_reef\n        environment_type\n        development_level\n        has_nightlife\n      }\n    }\n  }\n":
    types.GetPlaceByIdDocument,
  "\n  query getPlaceMedia($placeId: [String!], $mimeType: [String!]) {\n    allMedia(place_id: $placeId, mime_type: $mimeType) {\n      media {\n        id\n        url\n      }\n    }\n  }\n":
    types.GetPlaceMediaDocument,
  "\n  query GetPlaceVideos($placeId: [String!], $current: Int) {\n    allMedia(place_id: $placeId, current: $current) {\n      media {\n        id\n        mime_type\n        url\n        miniature_url\n        stream_url\n      }\n      info {\n        count\n        next\n        pages\n        prev\n      }\n    }\n  }\n":
    types.GetPlaceVideosDocument,
  "\n    query getMagicalTowns($isCover: [Boolean!], $stateId: [String!], $idCategory: [String!]) {\n  places(isCover: $isCover, state_id: $stateId, id_category: $idCategory) {\n    places {\n      id\n      name\n      medias {\n        url\n      }\n    }\n  }\n}\n  ":
    types.GetMagicalTownsDocument,
  "\n    query getTopPlaces($limit: Int, $isCover: [Boolean!], $mimeType: [String!]) {\n  places(limit: $limit, isCover: $isCover, mime_type: $mimeType) {\n    places {\n      name\n      state {\n        name\n      }\n      id\n      medias {\n        url\n      }\n    }\n  }\n}\n":
    types.GetTopPlacesDocument,
  "\n  query getAllStates {\n      states {\n        id\n        name\n        description\n      }\n  }\n":
    types.GetAllStatesDocument,
  "\n  query getAllPlacesByName($name: String) {\n    places(name: $name) {\n      places {\n        id\n        name\n        category {\n          category\n        }\n      }\n    }\n  }\n":
    types.GetAllPlacesByNameDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getEventsByCategory($idCategory: [String!]) {\n    events(id_category: $idCategory) {\n      events {\n        id\n        name\n        start_date\n        end_date\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getEventsByCategory($idCategory: [String!]) {\n    events(id_category: $idCategory) {\n      events {\n        id\n        name\n        start_date\n        end_date\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getNextCulturalEvents($isCover: [Boolean!], $mimeType: [String!], $limit: Int, $current: Int, $startDate: DateTime, $idCategory: [String!]) {\n    events(isCover: $isCover, mime_type: $mimeType, limit: $limit, current: $current, start_date: $startDate, id_category: $idCategory) {\n      events {\n        id\n        name\n        start_date\n        end_date\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getNextCulturalEvents($isCover: [Boolean!], $mimeType: [String!], $limit: Int, $current: Int, $startDate: DateTime, $idCategory: [String!]) {\n    events(isCover: $isCover, mime_type: $mimeType, limit: $limit, current: $current, start_date: $startDate, id_category: $idCategory) {\n      events {\n        id\n        name\n        start_date\n        end_date\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetFeedVideos($current: Int, $mimeType: [String!], $isRandom: Boolean, $seed: Int) {\n    allMedia(current: $current, mime_type: $mimeType, isRandom: $isRandom, seed: $seed) {\n      media {\n        url\n        id\n        miniature_url\n        stream_url\n        place {\n          id\n          name\n          description\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"
): (typeof documents)["\n  query GetFeedVideos($current: Int, $mimeType: [String!], $isRandom: Boolean, $seed: Int) {\n    allMedia(current: $current, mime_type: $mimeType, isRandom: $isRandom, seed: $seed) {\n      media {\n        url\n        id\n        miniature_url\n        stream_url\n        place {\n          id\n          name\n          description\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getCategories {\n    categories {\n      id_category\n      category\n    }\n  }\n"
): (typeof documents)["\n  query getCategories {\n    categories {\n      id_category\n      category\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetAllCities($current: Int, $idCategory: [String!], $regions: [ValidRegions!], $mimeType: [String!], $isCover: [Boolean!], $isRandom: Boolean, $seed: Int) {\n    places(current: $current, id_category: $idCategory, regions: $regions, mime_type: $mimeType, isCover: $isCover, isRandom: $isRandom, seed: $seed) {\n      places {\n        id\n        name\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n      info {\n        count\n        next\n        pages\n        prev\n      }\n    }\n  }\n"
): (typeof documents)["\n  query GetAllCities($current: Int, $idCategory: [String!], $regions: [ValidRegions!], $mimeType: [String!], $isCover: [Boolean!], $isRandom: Boolean, $seed: Int) {\n    places(current: $current, id_category: $idCategory, regions: $regions, mime_type: $mimeType, isCover: $isCover, isRandom: $isRandom, seed: $seed) {\n      places {\n        id\n        name\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n      info {\n        count\n        next\n        pages\n        prev\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetAllEventsByPlaces($startDate: DateTime) {\n    events(start_date: $startDate) {\n      events {\n        id\n        name\n        start_date\n        end_date\n        state {\n          name\n        }\n        category {\n          category\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query GetAllEventsByPlaces($startDate: DateTime) {\n    events(start_date: $startDate) {\n      events {\n        id\n        name\n        start_date\n        end_date\n        state {\n          name\n        }\n        category {\n          category\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getAllNearbyMagicalTowns($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!]) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getAllNearbyMagicalTowns($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!]) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getAllNearbyPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!]) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getAllNearbyPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!]) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetAllPlacesByCategory($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int, $idCategory: [String!], $limit: Int) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed, id_category: $idCategory, limit: $limit) {\n    places {\n      id\n      name\n      state {\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n"
): (typeof documents)["\n  query GetAllPlacesByCategory($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int, $idCategory: [String!], $limit: Int) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed, id_category: $idCategory, limit: $limit) {\n    places {\n      id\n      name\n      state {\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetAllPlacesByState($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int, $stateId: [String!]) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed, state_id: $stateId) {\n    places {\n      id\n      name\n      state {\n        id\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n"
): (typeof documents)["\n  query GetAllPlacesByState($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int, $stateId: [String!]) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed, state_id: $stateId) {\n    places {\n      id\n      name\n      state {\n        id\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetAllPlaces($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed) {\n    places {\n      id\n      name\n      state {\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n"
): (typeof documents)["\n  query GetAllPlaces($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int) {\n  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed) {\n    places {\n      id\n      name\n      state {\n        name\n      }\n      medias {\n        url\n      }\n      category {\n        category\n      }\n    }\n    info {\n      count\n      next\n      pages\n      prev\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getCities($idCategory: [String!], $regions: [ValidRegions!], $mimeType: [String!], $isCover: [Boolean!], $limit: Int) {\n    places(id_category: $idCategory, regions: $regions, mime_type: $mimeType, isCover: $isCover, limit: $limit) {\n      places {\n        name\n        id\n        medias {\n          url\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getCities($idCategory: [String!], $regions: [ValidRegions!], $mimeType: [String!], $isCover: [Boolean!], $limit: Int) {\n    places(id_category: $idCategory, regions: $regions, mime_type: $mimeType, isCover: $isCover, limit: $limit) {\n      places {\n        name\n        id\n        medias {\n          url\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getMostPopularMagicalTown($idCategory: [String!], $limit: Int, $isCover: [Boolean!]) {\n    places(id_category: $idCategory, limit: $limit, isCover: $isCover) {\n      places {\n        id\n        name\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getMostPopularMagicalTown($idCategory: [String!], $limit: Int, $isCover: [Boolean!]) {\n    places(id_category: $idCategory, limit: $limit, isCover: $isCover) {\n      places {\n        id\n        name\n        state {\n          name\n        }\n        medias {\n          url\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetMostPopularPlaces($limit: Int, $isCover: [Boolean!]) {\n    places(limit: $limit, isCover: $isCover) {\n      places {\n        id\n        name\n        medias {\n          url\n        }\n        state {\n          name\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query GetMostPopularPlaces($limit: Int, $isCover: [Boolean!]) {\n    places(limit: $limit, isCover: $isCover) {\n      places {\n        id\n        name\n        medias {\n          url\n        }\n        state {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getNearbyCulturalPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getNearbyCulturalPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getNearbyFoodPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getNearbyFoodPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getNearbyNaturePlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getNearbyNaturePlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {\n    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {\n      places {\n        id\n        name\n        latitude\n        longitude\n        category {\n           category\n        }\n        medias {\n           url\n        }\n        state {\n          name\n        }\n      }\n      info {\n        next\n        pages\n        prev\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query PlaceActivitiesByPlaceId($placeId: ID!, $current: Int, $mimeType: [String!], $isCover: [Boolean!]) {\n    placeActivitiesByPlaceId(placeId: $placeId, current: $current, mime_type: $mimeType, isCover: $isCover) {\n      info {\n        next\n        pages\n        prev\n      }\n      placeActivities {\n        id\n        activity_name\n        difficulty_level\n        additional_cost\n        requires_equipment\n        min_age\n        available_months\n        place_id\n        media {\n          url\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query PlaceActivitiesByPlaceId($placeId: ID!, $current: Int, $mimeType: [String!], $isCover: [Boolean!]) {\n    placeActivitiesByPlaceId(placeId: $placeId, current: $current, mime_type: $mimeType, isCover: $isCover) {\n      info {\n        next\n        pages\n        prev\n      }\n      placeActivities {\n        id\n        activity_name\n        difficulty_level\n        additional_cost\n        requires_equipment\n        min_age\n        available_months\n        place_id\n        media {\n          url\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetPlaceById($placeId: String!) {\n    place(id: $placeId) {\n      name\n      description\n      latitude\n      longitude\n      address\n      details\n      category {\n        category\n      }\n      placeAttributes {\n        is_pueblo_magico\n        is_unesco_heritage\n        is_protected_area\n        wheelchair_accessible\n        pet_friendly\n        has_parking\n        crowd_level\n        price_level\n        typical_visit_hours\n        recommended_days\n        best_seasons\n        avoid_seasons\n        ideal_months\n        requires_permit\n        requires_guide\n        estimated_daily_cost_min\n        estimated_daily_cost_max\n        accommodation_avg_cost\n        avg_temp_winter_celsius\n        avg_temp_summer_celsius\n        has_vegan_options\n        has_vegetarian_options\n        has_gluten_free\n        cuisine_types\n        culinary_speciality\n        food_avg_cost\n        beach_type\n        sand_color\n        wave_type\n        has_reef\n        environment_type\n        development_level\n        has_nightlife\n      }\n    }\n  }\n"
): (typeof documents)["\n  query GetPlaceById($placeId: String!) {\n    place(id: $placeId) {\n      name\n      description\n      latitude\n      longitude\n      address\n      details\n      category {\n        category\n      }\n      placeAttributes {\n        is_pueblo_magico\n        is_unesco_heritage\n        is_protected_area\n        wheelchair_accessible\n        pet_friendly\n        has_parking\n        crowd_level\n        price_level\n        typical_visit_hours\n        recommended_days\n        best_seasons\n        avoid_seasons\n        ideal_months\n        requires_permit\n        requires_guide\n        estimated_daily_cost_min\n        estimated_daily_cost_max\n        accommodation_avg_cost\n        avg_temp_winter_celsius\n        avg_temp_summer_celsius\n        has_vegan_options\n        has_vegetarian_options\n        has_gluten_free\n        cuisine_types\n        culinary_speciality\n        food_avg_cost\n        beach_type\n        sand_color\n        wave_type\n        has_reef\n        environment_type\n        development_level\n        has_nightlife\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getPlaceMedia($placeId: [String!], $mimeType: [String!]) {\n    allMedia(place_id: $placeId, mime_type: $mimeType) {\n      media {\n        id\n        url\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getPlaceMedia($placeId: [String!], $mimeType: [String!]) {\n    allMedia(place_id: $placeId, mime_type: $mimeType) {\n      media {\n        id\n        url\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetPlaceVideos($placeId: [String!], $current: Int) {\n    allMedia(place_id: $placeId, current: $current) {\n      media {\n        id\n        mime_type\n        url\n        miniature_url\n        stream_url\n      }\n      info {\n        count\n        next\n        pages\n        prev\n      }\n    }\n  }\n"
): (typeof documents)["\n  query GetPlaceVideos($placeId: [String!], $current: Int) {\n    allMedia(place_id: $placeId, current: $current) {\n      media {\n        id\n        mime_type\n        url\n        miniature_url\n        stream_url\n      }\n      info {\n        count\n        next\n        pages\n        prev\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    query getMagicalTowns($isCover: [Boolean!], $stateId: [String!], $idCategory: [String!]) {\n  places(isCover: $isCover, state_id: $stateId, id_category: $idCategory) {\n    places {\n      id\n      name\n      medias {\n        url\n      }\n    }\n  }\n}\n  "
): (typeof documents)["\n    query getMagicalTowns($isCover: [Boolean!], $stateId: [String!], $idCategory: [String!]) {\n  places(isCover: $isCover, state_id: $stateId, id_category: $idCategory) {\n    places {\n      id\n      name\n      medias {\n        url\n      }\n    }\n  }\n}\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n    query getTopPlaces($limit: Int, $isCover: [Boolean!], $mimeType: [String!]) {\n  places(limit: $limit, isCover: $isCover, mime_type: $mimeType) {\n    places {\n      name\n      state {\n        name\n      }\n      id\n      medias {\n        url\n      }\n    }\n  }\n}\n"
): (typeof documents)["\n    query getTopPlaces($limit: Int, $isCover: [Boolean!], $mimeType: [String!]) {\n  places(limit: $limit, isCover: $isCover, mime_type: $mimeType) {\n    places {\n      name\n      state {\n        name\n      }\n      id\n      medias {\n        url\n      }\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getAllStates {\n      states {\n        id\n        name\n        description\n      }\n  }\n"
): (typeof documents)["\n  query getAllStates {\n      states {\n        id\n        name\n        description\n      }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query getAllPlacesByName($name: String) {\n    places(name: $name) {\n      places {\n        id\n        name\n        category {\n          category\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query getAllPlacesByName($name: String) {\n    places(name: $name) {\n      places {\n        id\n        name\n        category {\n          category\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
