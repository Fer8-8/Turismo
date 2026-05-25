import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserMinimalProfile } from '../types/user-minimal.type';

// punto oficial consulta usuarios módulos
@Injectable()
export class UserFacade {
  constructor(private readonly userService: UserService) {}

  // ─── 9 & 15. CONSULTA Y PERFIL ────────────────────────────────────────────

  async getUserById(id: string) {
    return this.userService.findBusinessUser(id);
  }

  async getUserByEmail(email: string) {
    return this.userService.findBusinessUserByEmail(email);
  }

  async getUserByLogin(login: string) {
    return this.userService.findBusinessUserByLogin(login);
  }

  async getMinimalProfile(id: string): Promise<UserMinimalProfile> {
    return this.userService.getMinimalProfile(id);
  }

  // ─── 10. VALIDACIÓN ──────────────────────────────────────────────────────

  async validateUserExists(id: string): Promise<boolean> {
    return this.userService.validateUserExists(id);
  }

  async validateUserActive(id: string): Promise<boolean> {
    return this.userService.validateUserActive(id);
  }

  // ─── 7. ROLES ─────────────────────────────────────────────────────────────

  async getUserRoles(id: string) {
    return this.userService.getUserRoles(id);
  }

  async hasRole(id: string, roleName: string): Promise<boolean> {
    return this.userService.hasRole(id, roleName);
  }

  // ─── 3. DIRECCIONES ──────────────────────────────────────────────────────

  async getUserShipAddress(id: string) {
    return this.userService.getUserShipAddress(id);
  }

  async getUserBillAddress(id: string) {
    return this.userService.getUserBillAddress(id);
  }

  // ─── 6. STORE CREDITS ────────────────────────────────────────────────────

  async getUserStoreCreditBalance(id: string): Promise<number> {
    return this.userService.getUserStoreCreditBalance(id);
  }

  // ─── 13. INTEGRACIÓN CON AUTH ─────────────────────────────────────────────

  async findAuthUserByEmail(email: string) {
    return this.userService.findAuthUserByEmail(email);
  }
}
