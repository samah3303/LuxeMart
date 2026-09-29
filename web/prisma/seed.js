const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding dropshipping catalog for Goodfinds...');

  // 1. Smart Gadgets
  const tech = await prisma.category.upsert({
    where: { name: 'Smart Gadgets' },
    update: { name: 'Smart Gadgets' },
    create: {
      name: 'Smart Gadgets',
      products: {
        create: [
          {
            name: 'Sunset Projection Atmosphere Lamp',
            description: '360° rotating aluminum head with high-transmittance optical lens. Creates a warm golden hour halo for photography, bedroom aesthetics, and relaxation.',
            price: 799,
            costPrice: 220,
            supplierName: 'Roposo Clout',
            supplierUrl: 'https://roposoclout.com/catalog/sunset-lamp',
            image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&q=80',
            stock: 180
          },
          {
            name: 'Smart Visual Otoscope with 1080P HD Camera',
            description: 'Ultra-clear Wi-Fi connected visual ear cleaner. 6 LED cold lights, silicone ear scoops, compatible with iOS & Android smartphones.',
            price: 1299,
            costPrice: 380,
            supplierName: 'GlowRoad Hub',
            supplierUrl: 'https://glowroad.com/product/smart-ear-camera',
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
            stock: 95
          },
          {
            name: 'Solar-Powered Rotating Double Ring Car Perfume',
            description: 'Precision alloy kinetic double-ring car dashboard aroma diffuser. Spins automatically in sunlight with zero battery required.',
            price: 599,
            costPrice: 175,
            supplierName: 'Roposo Clout',
            supplierUrl: 'https://roposoclout.com/catalog/car-solar-aroma',
            image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80',
            stock: 220
          }
        ]
      }
    }
  });

  // 2. Kitchen Innovations
  const kitchen = await prisma.category.upsert({
    where: { name: 'Kitchen Innovations' },
    update: { name: 'Kitchen Innovations' },
    create: {
      name: 'Kitchen Innovations',
      products: {
        create: [
          {
            name: '4-in-1 Handheld Electric Vegetable Cutter & Slicer',
            description: 'Wireless food processor, garlic masher, chili mincer, and electric cleaning brush in one compact USB-rechargeable tool.',
            price: 849,
            costPrice: 260,
            supplierName: 'Roposo Clout',
            supplierUrl: 'https://roposoclout.com/catalog/veg-cutter-4in1',
            image: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=600&q=80',
            stock: 140
          },
          {
            name: 'Portable USB Rechargeable Smoothie Blender Bottle',
            description: '350ml personal sports juicer cup with 6 stainless steel 3D blades and magnetic rapid charging dock. BPA-free food grade PCTG.',
            price: 1199,
            costPrice: 390,
            supplierName: 'CJ Dropshipping',
            supplierUrl: 'https://cjdropshipping.com/product/blender-bottle',
            image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80',
            stock: 80
          },
          {
            name: 'Automatic Rechargeable Water Can Dispenser',
            description: 'Wireless electric water pump with food-grade silicone hose and USB charging. Fits standard 20L water cans for instant one-touch dispensing.',
            price: 699,
            costPrice: 199,
            supplierName: 'GlowRoad Hub',
            supplierUrl: 'https://glowroad.com/product/water-pump',
            image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
            stock: 160
          }
        ]
      }
    }
  });

  // 3. Home & Living
  const home = await prisma.category.upsert({
    where: { name: 'Home & Living' },
    update: { name: 'Home & Living' },
    create: {
      name: 'Home & Living',
      products: {
        create: [
          {
            name: 'Flame Volcano Ultrasonic Aroma Diffuser & Humidifier',
            description: 'Realistic 3D fire flame & volcano ring mist effect with warm LED ambient lighting. Auto shut-off when water level runs out.',
            price: 1499,
            costPrice: 480,
            supplierName: 'Roposo Clout',
            supplierUrl: 'https://roposoclout.com/catalog/flame-diffuser',
            image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
            stock: 110
          },
          {
            name: 'Magnetic Motion-Sensor Wireless LED Light Bar',
            description: 'Ultra-thin under-cabinet lighting bar with dual smart sensor (PIR motion + light). 3 color temperature modes, USB-C rechargeable.',
            price: 649,
            costPrice: 185,
            supplierName: 'GlowRoad Hub',
            supplierUrl: 'https://glowroad.com/product/motion-sensor-light',
            image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80',
            stock: 250
          }
        ]
      }
    }
  });

  // 4. Personal Care & Lifestyle
  const personal = await prisma.category.upsert({
    where: { name: 'Personal Care & Lifestyle' },
    update: { name: 'Personal Care & Lifestyle' },
    create: {
      name: 'Personal Care & Lifestyle',
      products: {
        create: [
          {
            name: 'Ultrasonic High-Frequency Jewelry & Eyewear Cleaner',
            description: '45,000Hz high-frequency vibration deep cleaning tank. Safely removes grime, oil, and tarnish from glasses, watches, rings, and retainers in 3 mins.',
            price: 999,
            costPrice: 310,
            supplierName: 'CJ Dropshipping',
            supplierUrl: 'https://cjdropshipping.com/product/ultrasonic-cleaner',
            image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
            stock: 75
          },
          {
            name: 'Rechargeable Fabric Shaver & Clothes Lint Remover',
            description: 'Honeycomb 6-blade rotary system gently restores sweaters, furniture upholstery, and blankets. Integrated safety lock & lint reservoir.',
            price: 549,
            costPrice: 160,
            supplierName: 'Roposo Clout',
            supplierUrl: 'https://roposoclout.com/catalog/lint-remover',
            image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=600&q=80',
            stock: 190
          }
        ]
      }
    }
  });

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@goodfinds.com' },
    update: {},
    create: {
      email: 'admin@goodfinds.com',
      name: 'Goodfinds Operations',
      role: 'ADMIN'
    }
  });

  console.log('Seeding finished successfully with 10 viral dropshipping products!');
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
