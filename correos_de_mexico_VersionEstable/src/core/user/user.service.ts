import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCdmUserInput } from './dto/create-cdm-user.input';
import { UpdateCdmUserInput } from './dto/update-cdm-user.input';
import { FilterUsersInput } from './dto/filter-users.input';
import { UserMinimalProfile } from './types/user-minimal.type';

// gestiona usuarios de negocio, direcciones, órdenes créditos
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── 1 & 2. CRUD DE USUARIO DE NEGOCIO ────────────────────────────────────

  async createBusinessUser(input: CreateCdmUserInput) {
    if (input.email) {
      const existing = await this.prisma.cdmUser.findFirst({ where: { email: input.email } });
      if (existing) throw new BadRequestException('El email ya está registrado en usuarios de negocio');
    }
    if (input.login) {
      const existing = await this.prisma.cdmUser.findFirst({ where: { login: input.login } });
      if (existing) throw new BadRequestException('El login ya está en uso');
    }
    return this.prisma.cdmUser.create({ data: input });
  }

  async findAllBusinessUsers(filter?: FilterUsersInput, skip = 0, take = 20) {
    const where = this.buildWhereClause(filter);
    return this.prisma.cdmUser.findMany({ where, skip, take, orderBy: { created_at: 'desc' } });
  }

  async findBusinessUser(id: string) {
    const user = await this.prisma.cdmUser.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario de negocio ${id} no encontrado`);
    return user;
  }

  async findBusinessUserByEmail(email: string) {
    return this.prisma.cdmUser.findFirst({ where: { email } });
  }

  async findBusinessUserByLogin(login: string) {
    return this.prisma.cdmUser.findFirst({ where: { login } });
  }

  async updateBusinessUser(id: string, input: UpdateCdmUserInput) {
    await this.findBusinessUser(id);
    const { id: _, ...data } = input;
    return this.prisma.cdmUser.update({ where: { id }, data });
  }

  // baja lógica: establece locked_at para desactivar al usuario
  async deactivateUser(id: string) {
    await this.findBusinessUser(id);
    return this.prisma.cdmUser.update({ where: { id }, data: { locked_at: new Date() } });
  }

  // reactiva un usuario previamente desactivado
  async reactivateUser(id: string) {
    await this.findBusinessUser(id);
    return this.prisma.cdmUser.update({ where: { id }, data: { locked_at: null } });
  }

  async countBusinessUsers(filter?: FilterUsersInput): Promise<number> {
    return this.prisma.cdmUser.count({ where: this.buildWhereClause(filter) });
  }

  // ─── 3. RELACIÓN CON DIRECCIONES ──────────────────────────────────────────

  async getUserAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { user_id: userId, deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  async getUserShipAddress(userId: string) {
    const user = await this.prisma.cdmUser.findUnique({
      where: { id: userId },
      select: { ship_address_id: true },
    });
    if (!user?.ship_address_id) return null;
    return this.prisma.address.findUnique({ where: { id: user.ship_address_id } });
  }

  async getUserBillAddress(userId: string) {
    const user = await this.prisma.cdmUser.findUnique({
      where: { id: userId },
      select: { bill_address_id: true },
    });
    if (!user?.bill_address_id) return null;
    return this.prisma.address.findUnique({ where: { id: user.bill_address_id } });
  }

  async setDefaultShipAddress(userId: string, addressId: string) {
    await this.findBusinessUser(userId);
    const address = await this.prisma.address.findFirst({ where: { id: addressId, user_id: userId } });
    if (!address) throw new NotFoundException('Dirección no encontrada o no pertenece al usuario');
    return this.prisma.cdmUser.update({ where: { id: userId }, data: { ship_address_id: addressId } });
  }

  async setDefaultBillAddress(userId: string, addressId: string) {
    await this.findBusinessUser(userId);
    const address = await this.prisma.address.findFirst({ where: { id: addressId, user_id: userId } });
    if (!address) throw new NotFoundException('Dirección no encontrada o no pertenece al usuario');
    return this.prisma.cdmUser.update({ where: { id: userId }, data: { bill_address_id: addressId } });
  }

  // ─── 4. RELACIÓN CON ÓRDENES ──────────────────────────────────────────────

  async getUserOrders(userId: string, take = 20, skip = 0) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        number: true,
        state: true,
        total: true,
        item_total: true,
        completed_at: true,
        shipment_state: true,
        payment_state: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
      take,
      skip,
    });
  }

  // ─── 5. RELACIÓN CON TARJETAS ─────────────────────────────────────────────

  async getUserCreditCards(userId: string) {
    return this.prisma.creditCard.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        cc_type: true,
        last_digits: true,
        month: true,
        year: true,
        name: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // ─── 6. RELACIÓN CON STORE CREDITS ────────────────────────────────────────

  async getUserStoreCredits(userId: string) {
    return this.prisma.storeCredit.findMany({
      where: { user_id: userId, deleted_at: null },
      select: {
        id: true,
        amount: true,
        amount_used: true,
        amount_authorized: true,
        memo: true,
        currency: true,
        deleted_at: true,
      },
    });
  }

  async getUserStoreCreditBalance(userId: string): Promise<number> {
    const credits = await this.prisma.storeCredit.findMany({
      where: { user_id: userId, deleted_at: null },
      select: { amount: true, amount_used: true },
    });
    return credits.reduce((acc, c) => acc + (Number(c.amount) - Number(c.amount_used)), 0);
  }

  // ─── 7. ROLES DEL USUARIO ─────────────────────────────────────────────────

  async getUserRoles(userId: string) {
    const roleUsers = await this.prisma.roleUser.findMany({
      where: { user_id: userId },
      include: { role: true },
    });
    return roleUsers.map((ru) => ru.role).filter(Boolean);
  }

  async assignRole(userId: string, roleId: string) {
    await this.findBusinessUser(userId);
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException(`Rol ${roleId} no encontrado`);
    const existing = await this.prisma.roleUser.findFirst({ where: { user_id: userId, role_id: roleId } });
    if (existing) return;
    await this.prisma.roleUser.create({ data: { user_id: userId, role_id: roleId } });
  }

  async removeRole(userId: string, roleId: string) {
    const roleUser = await this.prisma.roleUser.findFirst({ where: { user_id: userId, role_id: roleId } });
    if (!roleUser) return;
    await this.prisma.roleUser.delete({ where: { id: roleUser.id } });
  }

  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const count = await this.prisma.roleUser.count({
      where: { user_id: userId, role: { name: roleName } },
    });
    return count > 0;
  }

  // ─── 8. TRAZABILIDAD ─────────────────────────────────────────────────────

  async getUserStateChanges(userId: string) {
    return this.prisma.stateChange.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  // ─── 9, 10, 12, 15. VALIDACIÓN Y PERFIL MÍNIMO ───────────────────────────

  async validateUserExists(id: string): Promise<boolean> {
    const count = await this.prisma.cdmUser.count({ where: { id } });
    return count > 0;
  }

  async validateUserActive(id: string): Promise<boolean> {
    const user = await this.prisma.cdmUser.findUnique({
      where: { id },
      select: { locked_at: true },
    });
    return user !== null && user.locked_at === null;
  }

  async getMinimalProfile(id: string): Promise<UserMinimalProfile> {
    const user = await this.prisma.cdmUser.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        login: true,
        locked_at: true,
        ship_address_id: true,
        bill_address_id: true,
        roleUsers: { include: { role: { select: { name: true } } } },
      },
    });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      login: user.login,
      locked: user.locked_at !== null,
      ship_address_id: user.ship_address_id,
      bill_address_id: user.bill_address_id,
      roles: user.roleUsers.map((ru) => ru.role?.name).filter(Boolean) as string[],
    };
  }

  // ─── 11. GESTIÓN ADMINISTRATIVA ──────────────────────────────────────────

  async getUserProfile(id: string) {
    const user = await this.prisma.cdmUser.findUnique({
      where: { id },
      include: {
        shipAddress: true,
        billAddress: true,
        addresses: { where: { deleted_at: null } },
        roleUsers: { include: { role: true } },
      },
    });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }

  // ─── 13. INTEGRACIÓN CON AUTH ─────────────────────────────────────────────

  async findAuthUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAuthUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAllAuthUsers() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findAuthUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario auth ${id} no encontrado`);
    return user;
  }

  // ─── HELPERS PRIVADOS ────────────────────────────────────────────────────

  private buildWhereClause(filter?: FilterUsersInput) {
    if (!filter) return {};
    const where: any = {};
    if (filter.email) where.email = { contains: filter.email, mode: 'insensitive' };
    if (filter.name) where.name = { contains: filter.name, mode: 'insensitive' };
    if (filter.login) where.login = { contains: filter.login, mode: 'insensitive' };
    if (filter.activeOnly === true) where.locked_at = null;
    if (filter.role) where.roleUsers = { some: { role: { name: filter.role } } };
    return where;
  }
}
