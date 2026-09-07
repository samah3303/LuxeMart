const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');
  
  // Create Categories & Products
  const kitchen = await prisma.category.upsert({
    where: { name: 'Kitchen & Home' },
    update: {},
    create: {
      name: 'Kitchen & Home',
      products: {
        create: [
          {
            name: 'Automatic Rechargeable Water Can Dispenser',
            description: 'Wireless electric water pump with USB charging. Fits standard 20L water cans for instant water dispensing.',
            price: 799,
            costPrice: 249,
            supplierName: 'Roposo Clout',
            supplierUrl: 'https://roposoclout.com/catalog/water-pump',
            image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
            stock: 120
          },
          {
            name: '12-in-1 Multi-Blade Vegetable & Fruit Chopper',
            description: 'Heavy duty kitchen slicer, dicer, and grater with stainless steel blades and catch container bowl.',
            price: 899,
            costPrice: 299,
            supplierName: 'GlowRoad',
            supplierUrl: 'https://glowroad.com/product/chopper-12in1',
            image: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=600&q=80',
            stock: 85
          }
        ]
      }
    }
  });

  const fashion = await prisma.category.upsert({
    where: { name: 'Fashion & Ethnic' },
    update: {},
    create: {
      name: 'Fashion & Ethnic',
      products: {
        create: [
          {
            name: 'Traditional Woven Cotton Kurti',
            description: 'Handloom finish pure cotton kurti with golden border detailing. Elegant for celebrations and daily ethnic wear.',
            price: 1199,
            costPrice: 420,
            supplierName: 'Tirupur Textiles Hub',
            supplierUrl: 'https://indiamart.com/tirupur-hub',
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
            stock: 60
          },
          {
            name: 'Premium Chiffon Instant Hijab with Magnetic Pins',
            description: 'Breathable lightweight chiffon hijab bundle with 4 matte magnetic pins. Non-slip, wrinkle-resistant.',
            price: 649,
            costPrice: 190,
            supplierName: 'Surat Modest Wear Direct',
            supplierUrl: 'https://indiamart.com/surat-modest',
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
            stock: 150
          }
        ]
      }
    }
  });

  const gadgets = await prisma.category.upsert({
    where: { name: 'Car & Tech Gadgets' },
    update: {},
    create: {
      name: 'Car & Tech Gadgets',
      products: {
        create: [
          {
            name: 'Solar-Powered Rotating Double Ring Car Perfume',
            description: 'Alloy kinetic double-ring car dashboard aroma diffuser. Spins automatically in sunlight with zero battery required.',
            price: 599,
            costPrice: 180,
            supplierName: 'Roposo Clout',
            supplierUrl: 'https://roposoclout.com/catalog/car-solar-aroma',
            image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80',
            stock: 200
          }
        ]
      }
    }
  });

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@goodfinds.com' },
    update: {},
    create: {
      email: 'admin@goodfinds.com',
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  console.log({ kitchen, fashion, gadgets, admin });
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
