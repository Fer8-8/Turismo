import { registerEnumType } from "@nestjs/graphql";
import { travel_party_types as TravelPartyType } from "@prisma/client";



export { TravelPartyType };

registerEnumType(TravelPartyType, { 
    name: 'TravelPartyType',
    description: 'Tipos de grupos de viaje disponibles para los lugares'
});
