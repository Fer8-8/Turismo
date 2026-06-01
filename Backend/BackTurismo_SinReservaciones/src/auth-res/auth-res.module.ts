import { Module } from '@nestjs/common';
import { AuthResService } from './auth-res.service';
import { AuthResController } from './auth-res.controller';

@Module({
  controllers: [AuthResController],
  providers: [AuthResService],
})
export class AuthResModule {}
