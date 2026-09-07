'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      success: true,
      products: products.map((p) => ({
        ...p,
        price: Number(p.price),
        costPrice: Number(p.costPrice),
      })),
    };
  } catch (error: any) {
    console.error('Failed to get products:', error);
    return { success: false, products: [] };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) return { success: false, product: null };
    return {
      success: true,
      product: {
        ...product,
        price: Number(product.price),
        costPrice: Number(product.costPrice),
      },
    };
  } catch (error: any) {
    console.error('Failed to get product:', error);
    return { success: false, product: null };
  }
}

export async function createProduct(formData: {
  name: string;
  description: string;
  price: number;
  costPrice: number;
  supplierName: string;
  supplierUrl?: string;
  image: string;
  categoryName: string;
  stock: number;
}) {
  try {
    let category = await prisma.category.findUnique({
      where: { name: formData.categoryName },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: formData.categoryName },
      });
    }

    const product = await prisma.product.create({
      data: {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        costPrice: formData.costPrice,
        supplierName: formData.supplierName || 'Direct Supplier',
        supplierUrl: formData.supplierUrl,
        image: formData.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
        categoryId: category.id,
        stock: formData.stock || 50,
      },
    });

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin');

    return { success: true, product };
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return { success: false, error: error.message };
  }
}
