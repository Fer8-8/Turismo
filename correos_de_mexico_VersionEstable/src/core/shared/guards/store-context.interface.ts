// contexto de tienda extraído del header x-store-id
// se pasa explícitamente a los servicios, nunca con request scope
export interface StoreContext {
  readonly storeId: string;
}
