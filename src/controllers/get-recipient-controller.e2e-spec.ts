import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { GetRecipientController } from './get-recipient.controller';

describe('GetRecipientController', () => {
  let controller: GetRecipientController;
  let prismaMock: Partial<PrismaService>;

  const recipientId = 'recipient-uuid';
  const recipientDocument = '12345678900';
  const recipientEmail = 'jane@example.com';

  beforeEach(() => {
    prismaMock = {
      recipient: {
        findFirst: vi.fn(),
      },
    };

    controller = new GetRecipientController(prismaMock as any);
  });

  it('should return recipient when found by ID', async () => {
    (prismaMock.recipient.findFirst as any).mockResolvedValue({
      id: recipientId,
      name: 'Jane Doe',
      documentId: recipientDocument,
      email: recipientEmail,
      address: '123 Main St',
    });

    const result = await controller.handle(recipientId);

    expect(prismaMock.recipient.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          { id: recipientId },
          { documentId: recipientId },
          { email: recipientId },
        ],
      },
      select: {
        id: true,
        name: true,
        documentId: true,
        email: true,
        address: true,
      },
    });

    expect(result).toEqual({
      id: recipientId,
      name: 'Jane Doe',
      documentId: recipientDocument,
      email: recipientEmail,
      address: '123 Main St',
    });
  });

  it('should return recipient when found by document ID', async () => {
    (prismaMock.recipient.findFirst as any).mockResolvedValue({
      id: recipientId,
      name: 'John Doe',
      documentId: recipientDocument,
      email: recipientEmail,
      address: '456 Oak St',
    });

    const result = await controller.handle(recipientDocument);

    expect(result).toEqual({
      id: recipientId,
      name: 'John Doe',
      documentId: recipientDocument,
      email: recipientEmail,
      address: '456 Oak St',
    });
  });

  it('should return recipient when found by email', async () => {
    (prismaMock.recipient.findFirst as any).mockResolvedValue({
      id: recipientId,
      name: 'Alice Doe',
      documentId: '11122233344',
      email: recipientEmail,
      address: '789 Pine St',
    });

    const result = await controller.handle(recipientEmail);

    expect(result).toEqual({
      id: recipientId,
      name: 'Alice Doe',
      documentId: '11122233344',
      email: recipientEmail,
      address: '789 Pine St',
    });
  });

  it('should throw NotFoundException if recipient does not exist', async () => {
    (prismaMock.recipient.findFirst as any).mockResolvedValue(null);

    await expect(controller.handle('nonexistent-id')).rejects.toThrow(
      NotFoundException,
    );

    await expect(controller.handle('nonexistent-id')).rejects.toThrow(
      'Recipient not found.',
    );
  });
});
