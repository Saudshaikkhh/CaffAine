import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const totalUsers = await this.prisma.user.count({
            where: { role: 'CUSTOMER' }
        });

        const totalOrders = await this.prisma.order.count();

        const orders = await this.prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        const totalRevenue = orders.reduce((acc, order) => {
            const orderTotal = order.items.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
            }, 0);
            return acc + orderTotal;
        }, 0);

        const products = await this.prisma.product.findMany();
        const lowInventoryProducts = products.filter(p => p.inventory < 20);

        return {
            totalUsers,
            totalOrders,
            totalRevenue,
            lowInventoryCount: lowInventoryProducts.length,
            recentSales: orders.slice(0, 10), // Optional: for more detailed reports
        };
    }
}
