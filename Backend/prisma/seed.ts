import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!.replace('file:', ''),
});
const prisma = new PrismaClient({ adapter } as any);

async function main() {
    console.log('Seeding database...');

    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Seed users
    await prisma.user.createMany({
        data: [
            {
                email: 'admin@caffaine.com',
                password: 'adminpassword',
                name: 'Admin User',
                role: 'ADMIN',
            },
            {
                email: 'customer@gmail.com',
                password: 'customerpassword',
                name: 'Regular Customer',
                role: 'CUSTOMER',
            },
        ],
    });

    // Seed products
    const products = await prisma.product.createMany({
        data: [
            // HOT drinks
            {
                name: 'Espresso',
                description: 'Rich and bold single shot of pure coffee essence',
                price: 3.50,
                category: 'HOT',
                inventory: 100,
            },
            {
                name: 'Double Espresso',
                description: 'Two shots of intense espresso for the serious coffee lover',
                price: 4.50,
                category: 'HOT',
                inventory: 100,
            },
            {
                name: 'Cappuccino',
                description: 'Espresso with steamed milk foam, dusted with cocoa',
                price: 5.00,
                category: 'HOT',
                inventory: 100,
            },
            {
                name: 'Latte',
                description: 'Smooth espresso with creamy steamed milk',
                price: 5.50,
                category: 'HOT',
                inventory: 100,
            },
            {
                name: 'Americano',
                description: 'Espresso diluted with hot water for a milder taste',
                price: 4.00,
                category: 'HOT',
                inventory: 100,
            },
            {
                name: 'Mocha',
                description: 'Espresso with chocolate and steamed milk, topped with whipped cream',
                price: 6.00,
                category: 'HOT',
                inventory: 100,
            },
            {
                name: 'Chamomile Tea',
                description: 'Soothing herbal tea with calming chamomile flowers',
                price: 3.50,
                category: 'HOT',
                inventory: 50,
            },

            // COLD drinks
            {
                name: 'Iced Americano',
                description: 'Chilled espresso with cold water over ice',
                price: 4.50,
                category: 'COLD',
                inventory: 100,
            },
            {
                name: 'Iced Latte',
                description: 'Espresso with cold milk served over ice',
                price: 5.50,
                category: 'COLD',
                inventory: 100,
            },
            {
                name: 'Iced Caramel Macchiato',
                description: 'Vanilla-flavored milk with espresso and caramel drizzle',
                price: 6.50,
                category: 'COLD',
                inventory: 100,
            },
            {
                name: 'Cold Brew',
                description: 'Slow-steeped for 20 hours, smooth and refreshing',
                price: 5.00,
                category: 'COLD',
                inventory: 80,
            },
            {
                name: 'Iced Mocha',
                description: 'Chilled chocolate espresso with milk and whipped cream',
                price: 6.50,
                category: 'COLD',
                inventory: 100,
            },

            // DESSERT
            {
                name: 'Chocolate Chip Cookie',
                description: 'Freshly baked with gooey chocolate chips',
                price: 2.50,
                category: 'DESSERT',
                inventory: 50,
            },
            {
                name: 'Blueberry Muffin',
                description: 'Soft and moist muffin bursting with blueberries',
                price: 3.50,
                category: 'DESSERT',
                inventory: 40,
            },
            {
                name: 'Croissant',
                description: 'Buttery and flaky French pastry',
                price: 3.00,
                category: 'DESSERT',
                inventory: 30,
            },
            {
                name: 'Cheesecake Slice',
                description: 'Creamy New York style cheesecake with graham crust',
                price: 5.50,
                category: 'DESSERT',
                inventory: 20,
            },
            {
                name: 'Tiramisu',
                description: 'Italian coffee-flavored layered dessert with mascarpone',
                price: 6.00,
                category: 'DESSERT',
                inventory: 15,
            },
        ],
    });

    console.log(`Seeded ${products.count} products`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
