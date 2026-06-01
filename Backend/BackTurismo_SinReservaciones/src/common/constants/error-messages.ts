export const ERROR_MSG = {
    UNAUTHORIZED: "Unauthorized",

    CANNOT_MODIFY: (field: string) => `No tienes permisos para modificar el campo ${field}`,
    REQUIRED_FIELD: (field: string) => `El campo ${field} es requerido`,
    NOT_ALLOWED: (action: string) => `No tienes permisos para ${action}`,
}
