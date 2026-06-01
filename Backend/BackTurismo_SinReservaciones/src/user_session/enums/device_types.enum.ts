import { registerEnumType } from "@nestjs/graphql";
import { device_types } from "@prisma/client";

registerEnumType(device_types, { name: 'device_types' })

export { device_types }
