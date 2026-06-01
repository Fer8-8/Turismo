import { registerEnumType } from "@nestjs/graphql";

export enum ValidRegions {
    Norte     = 'Norte', 
    Centro      = 'Centro',  
    Pacifico = 'Pacifico',
    Bajio = 'Bajio',
    Caribe = 'Caribe'
}

registerEnumType(ValidRegions, { name: 'ValidRegions' })