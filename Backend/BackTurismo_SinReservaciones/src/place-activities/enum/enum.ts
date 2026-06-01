import { registerEnumType } from "@nestjs/graphql";
import { difficulty_levels as DifficultyLevel } from "@prisma/client";



export { DifficultyLevel };

registerEnumType(DifficultyLevel, { 
    name: 'DifficultyLevel',
    description: 'Niveles de dificultad disponibles para las actividades'
});
