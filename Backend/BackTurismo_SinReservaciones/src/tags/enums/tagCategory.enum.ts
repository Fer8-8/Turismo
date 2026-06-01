import { registerEnumType } from "@nestjs/graphql";
import { tag_categories as TagCategory } from "@prisma/client";

// Exportamos el enum con el nombre que queremos usar en NestJS
export { TagCategory };

// Registramos el enum para que NestJS lo reconozca en GraphQL
registerEnumType(TagCategory, { 
    name: 'TagCategory',
    description: 'Categorías disponibles para los tags'
});