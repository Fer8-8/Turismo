import { CreatePlaceInput } from "src/places/dto/create-place.input";
import { PlaceRequest } from "../entities/place_request.entity";
import { CreatePlaceRequestInput } from "../dto/create-place_request.input";
import { UpdatePlaceRequestInput } from "../dto/update-place_request.input";

export class RequestMapper {
    static toEntity(prisma: any): PlaceRequest {
        return {
            ...prisma,
            id_place: prisma.id_place || null,
            place_json: prisma.place_json as CreatePlaceInput,
            history_json: (Array.isArray(prisma.history_json) ? prisma.history_json : []).map((entry: any) => ({
                ...entry,
                changed_at: new Date(entry.changed_at || entry.updated_at || new Date().toISOString()),
                changes: entry.changes || []
            })),
        };
    }

    static toPrismaCreate(input: CreatePlaceRequestInput) {
        return {
            id_user: input.id_user!,
            place_json: JSON.parse(JSON.stringify(input.place_json)),
            ...(input.id_place && { id_place: input.id_place }),
            ...(input.status !== undefined && { status: input.status })
        };
    }

    static toPrismaUpdate(input: UpdatePlaceRequestInput) {
        return {
            ...(input.status !== undefined && { status: input.status }),
            ...(input.id_place !== undefined && { id_place: input.id_place }),
            ...(input.place_json !== undefined && {
                place_json: JSON.parse(JSON.stringify(input.place_json))
            }),
        };
    }
}
