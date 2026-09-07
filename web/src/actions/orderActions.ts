'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  houseName: string;
  streetAddress: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  paymentMethod: 'UPI' | 'COD';
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export async function createOrder(input: CreateOrderInput) {
  try {
    if (!input.customerName || !input.customerPhone || !input.pincode) {
      return { success: false, error: 'Please provide customer name, phone number, and PIN code.' };
    }

    if (input.items.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 499 ? 0 : 79;
    const prepaidDiscount = input.paymentMethod === 'UPI' && subtotal >= 499 ? 70 : 0;
    const finalTotal = Math.max(0, subtotal + shippingFee - prepaidDiscount);

    const order = await prisma.order.create({
      data: {
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        houseName: input.houseName,
        streetAddress: input.streetAddress,
        landmark: input.landmark,
        city: input.city,
        district: input.district,
        state: input.state || '',
        pincode: input.pincode,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === 'UPI' ? 'PAID' : 'PENDING',
        prepaidDiscount,
        total: finalTotal,
        status: input.paymentMethod === 'UPI' ? 'CONFIRMED' : 'PENDING',
        fulfillmentStatus: 'PENDING_SUPPLIER',
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
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

    revalidatePath('/admin');
    revalidatePath('/admin/orders');

    return {
      success: true,
      orderId: order.id,
      orderNumber: `ORD-${order.id.slice(-6).toUpperCase()}`,
      order,
    };
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return { success: false, error: error.message || 'Something went wrong processing your order.' };
  }
}

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return { success: true, orders };
  } catch (error: any) {
    console.error('Failed to fetch orders:', error);
    return { success: false, orders: [] };
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return { success: true, order };
  } catch (error: any) {
    console.error('Failed to fetch order:', error);
    return { success: false, order: null };
  }
}

export async function updateFulfillment(orderId: string, data: {
  supplierOrderId?: string;
  courierName?: string;
  trackingNumber?: string;
  fulfillmentStatus?: string;
  paymentStatus?: string;
}) {
  try {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...data,
      },
    });
    revalidatePath('/admin');
    return { success: true, order: updated };
  } catch (error: any) {
    console.error('Failed to update fulfillment:', error);
    return { success: false, error: error.message };
  }
}
