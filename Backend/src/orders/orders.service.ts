import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async create(createOrderDto: CreateOrderDto) {
    const { userId, items, tableNumber } = createOrderDto;

    return this.prisma.$transaction(async (prisma) => {

      let total = 0;
      const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        if (product.inventory < item.quantity) {
          throw new NotFoundException(
            `Insufficient inventory for product "${product.name}". Available: ${product.inventory}, Requested: ${item.quantity}`,
          );
        }

        // Decrement inventory
        await prisma.product.update({
          where: { id: item.productId },
          data: { inventory: product.inventory - item.quantity },
        });

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        // Use connect for product relation since we have the ID
        orderItemsData.push({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          price: product.price,
        });
      }

      return prisma.order.create({
        data: {
          userId,
          tableNumber,
          total,
          status: 'PENDING',

          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {

    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items, ...rest } = updateOrderDto;
    return this.prisma.order.update({
      where: { id },
      data: rest,
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
