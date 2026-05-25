/**
 * UserMinimalProfile — Perfil mínimo de usuario para consumo entre módulos.
 * Usado por la facade para exponer solo lo necesario sin acoplar internals.
 */
export interface UserMinimalProfile {
  id: string;
  name: string | null;
  email: string | null;
  login: string | null;
  locked: boolean;
  ship_address_id: string | null;
  bill_address_id: string | null;
  roles: string[];
}
