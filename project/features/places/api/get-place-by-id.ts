import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { gqlClient } from "@/lib/graphql-client";

const getPlaceByIdQuery = graphql(`
  query GetPlaceById($placeId: String!) {
    place(id: $placeId) {
      name
      description
      latitude
      longitude
      address
      details
      category {
        category
      }
      placeAttributes {
        is_pueblo_magico
        is_unesco_heritage
        is_protected_area
        wheelchair_accessible
        pet_friendly
        has_parking
        crowd_level
        price_level
        typical_visit_hours
        recommended_days
        best_seasons
        avoid_seasons
        ideal_months
        requires_permit
        requires_guide
        estimated_daily_cost_min
        estimated_daily_cost_max
        accommodation_avg_cost
        avg_temp_winter_celsius
        avg_temp_summer_celsius
        has_vegan_options
        has_vegetarian_options
        has_gluten_free
        cuisine_types
        culinary_speciality
        food_avg_cost
        beach_type
        sand_color
        wave_type
        has_reef
        environment_type
        development_level
        has_nightlife
      }
    }
  }
`);

export function useGetPlaceById(placeId: string) {
  return useQuery({
    queryFn: () => gqlClient.request(getPlaceByIdQuery, { placeId }),
    queryKey: ["place-details", placeId],
    select: (data) => {
      const { placeAttributes, ...rest } = data.place;
      const category = data.place.category?.category;

      const base = {
        ...rest,
        category,
        isUnescoHeritage: placeAttributes?.is_unesco_heritage,
        isPuebloMagico: placeAttributes?.is_pueblo_magico,
        isProtectedArea: placeAttributes?.is_protected_area,
      };

      switch (category) {
        case "Gastronomia":
          return {
            ...base,
            details: {
              hasVeganOptions: placeAttributes?.has_vegan_options,
              hasVegetarianOptions: placeAttributes?.has_vegetarian_options,
              hasGlutenFree: placeAttributes?.has_gluten_free,
              cuisineTypes: placeAttributes?.cuisine_types,
              culinarySpeciality:
                placeAttributes?.culinary_speciality ?? undefined,
              foodAvgCost: placeAttributes?.food_avg_cost,
              wheelchairAccessible: placeAttributes?.wheelchair_accessible,
              hasParking: placeAttributes?.has_parking,
              petFriendly: placeAttributes?.pet_friendly,
              crowdLevel: placeAttributes?.crowd_level,
              priceLevel: placeAttributes?.price_level,
              schedule: data.place.details?.horario,
            },
          };

        case "Playa":
          return {
            ...base,
            details: {
              beachType: placeAttributes?.beach_type,
              sandColor: placeAttributes?.sand_color,
              waveType: placeAttributes?.wave_type,
              hasReef: placeAttributes?.has_reef,
              environmentType: placeAttributes?.environment_type,
              developmentLevel: placeAttributes?.development_level,
              avgTempWinterCelsius: placeAttributes?.avg_temp_winter_celsius,
              avgTempSummerCelsius: placeAttributes?.avg_temp_summer_celsius,
              estimatedDailyCostMin: placeAttributes?.estimated_daily_cost_min,
              estimatedDailyCostMax: placeAttributes?.estimated_daily_cost_max,
              wheelchairAccessible: placeAttributes?.wheelchair_accessible,
              hasParking: placeAttributes?.has_parking,
              petFriendly: placeAttributes?.pet_friendly,
              crowdLevel: placeAttributes?.crowd_level,
              bestSeasons: placeAttributes?.best_seasons,
              avoidSeasons: placeAttributes?.avoid_seasons,
              idealMonths: placeAttributes?.ideal_months,
            },
          };

        case "Naturaleza":
          return {
            ...base,
            details: {
              environmentType: placeAttributes?.environment_type,
              requiresPermit: placeAttributes?.requires_permit,
              requiresGuide: placeAttributes?.requires_guide,
              avgTempWinterCelsius: placeAttributes?.avg_temp_winter_celsius,
              avgTempSummerCelsius: placeAttributes?.avg_temp_summer_celsius,
              typicalVisitHours: placeAttributes?.typical_visit_hours,
              recommendedDays: placeAttributes?.recommended_days,
              estimatedDailyCostMin: placeAttributes?.estimated_daily_cost_min,
              estimatedDailyCostMax: placeAttributes?.estimated_daily_cost_max,
              accommodationAvgCost: placeAttributes?.accommodation_avg_cost,
              hasParking: placeAttributes?.has_parking,
              petFriendly: placeAttributes?.pet_friendly,
              crowdLevel: placeAttributes?.crowd_level,
              bestSeasons: placeAttributes?.best_seasons,
              avoidSeasons: placeAttributes?.avoid_seasons,
              idealMonths: placeAttributes?.ideal_months,
            },
          };

        case "Zona arqueológica":
          return {
            ...base,
            details: {
              requiresGuide: placeAttributes?.requires_guide,
              requiresPermit: placeAttributes?.requires_permit,
              typicalVisitHours: placeAttributes?.typical_visit_hours,
              recommendedDays: placeAttributes?.recommended_days,
              crowdLevel: placeAttributes?.crowd_level,
              priceLevel: placeAttributes?.price_level,
              wheelchairAccessible: placeAttributes?.wheelchair_accessible,
              hasParking: placeAttributes?.has_parking,
              bestSeasons: placeAttributes?.best_seasons,
              avoidSeasons: placeAttributes?.avoid_seasons,
              idealMonths: placeAttributes?.ideal_months,
            },
          };

        case "Pueblo Mágico":
          return {
            ...base,
            details: {
              foodAvgCost: placeAttributes?.food_avg_cost,
              accommodationAvgCost: placeAttributes?.accommodation_avg_cost,
              estimatedDailyCostMin: placeAttributes?.estimated_daily_cost_min,
              estimatedDailyCostMax: placeAttributes?.estimated_daily_cost_max,
              typicalVisitHours: placeAttributes?.typical_visit_hours,
              recommendedDays: placeAttributes?.recommended_days,
              petFriendly: placeAttributes?.pet_friendly,
              crowdLevel: placeAttributes?.crowd_level,
              bestSeasons: placeAttributes?.best_seasons,
              avoidSeasons: placeAttributes?.avoid_seasons,
              idealMonths: placeAttributes?.ideal_months,
            },
          };

        case "Cultura":
          return {
            ...base,
            details: {
              typicalVisitHours: placeAttributes?.typical_visit_hours,
              priceLevel: placeAttributes?.price_level,
              crowdLevel: placeAttributes?.crowd_level,
              wheelchairAccessible: placeAttributes?.wheelchair_accessible,
            },
          };

        case "Entretenimiento":
          return {
            ...base,
            details: {
              hasNightlife: placeAttributes?.has_nightlife,
              priceLevel: placeAttributes?.price_level,
              crowdLevel: placeAttributes?.crowd_level,
              typicalVisitHours: placeAttributes?.typical_visit_hours,
              wheelchairAccessible: placeAttributes?.wheelchair_accessible,
              hasParking: placeAttributes?.has_parking,
              petFriendly: placeAttributes?.pet_friendly,
            },
          };

        case "Vida Nocturna":
          return {
            ...base,
            details: {
              hasNightlife: placeAttributes?.has_nightlife,
              crowdLevel: placeAttributes?.crowd_level,
              priceLevel: placeAttributes?.price_level,
              typicalVisitHours: placeAttributes?.typical_visit_hours,
              wheelchairAccessible: placeAttributes?.wheelchair_accessible,
              hasParking: placeAttributes?.has_parking,
            },
          };

        default:
          return { ...base, details: null };
      }
    },
  });
}
