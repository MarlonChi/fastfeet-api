import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PrismaService } from '@/prisma/prisma.service';

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class GetAccountController {
  constructor(private prisma: PrismaService) {}

  @Get(':identifier')
  @HttpCode(200)
  async handle(@Param('identifier') identifier: string, @Req() req) {
    const user = req.user;

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Unauthorized access.');
    }

    const account = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: identifier }, { documentId: identifier }],
      },
      select: {
        id: true,
        name: true,
        documentId: true,
        role: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    return account;
  }
}
