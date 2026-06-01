import { registerEnumType } from "@nestjs/graphql";
import { price_levels as PriceLevel } from "@prisma/client";
import { environment_types as EnvironmentType } from "@prisma/client";
import { development_levels as DevelopmentLevel } from "@prisma/client";
import { crowd_levels as CrowdLevel } from "@prisma/client";
import { beach_types as BeachType } from "@prisma/client";
import { wave_types as WaveType } from "@prisma/client";


export { PriceLevel, 
         EnvironmentType,
         DevelopmentLevel,
         CrowdLevel,
         BeachType,
         WaveType
 };

registerEnumType(PriceLevel, { 
    name: 'PriceLevel',
    description: 'Niveles de precio disponibles para los lugares'
});

registerEnumType(EnvironmentType, { 
    name: 'EnvironmentType',
    description: 'Tipos de ambiente disponibles para los lugares'
});

registerEnumType(DevelopmentLevel, { 
    name: 'DevelopmentLevel',
    description: 'Niveles de desarrollo disponibles para los lugares'
});

registerEnumType(CrowdLevel, { 
    name: 'CrowdLevel',
    description: 'Niveles de multitud disponibles para los lugares'
});

registerEnumType(BeachType, { 
    name: 'BeachType',
    description: 'Tipos de playa disponibles para los lugares'
});

registerEnumType(WaveType, { 
    name: 'WaveType',
    description: 'Tipos de olas disponibles para los lugares'
});