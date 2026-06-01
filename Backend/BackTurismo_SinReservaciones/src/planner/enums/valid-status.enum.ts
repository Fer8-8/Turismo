import { registerEnumType } from "@nestjs/graphql";

export enum PlannerStatus {
    confirmed = 'confirmed',
    in_progress = 'in_progress',
    completed = 'completed'
}

registerEnumType(PlannerStatus, {
    name: 'PlannerStatus',
    description: 'Estados posibles para una ruta en el planner'
});