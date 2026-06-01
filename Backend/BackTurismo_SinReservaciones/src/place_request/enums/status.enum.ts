import { registerEnumType } from "@nestjs/graphql";
import { request_status } from "@prisma/client";

registerEnumType(request_status, { name: "request_status" })

export { request_status }
