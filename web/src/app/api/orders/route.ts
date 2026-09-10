import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.customerName || !body.customerPhone || !body.pincode) {
      return NextResponse.json(
        { success: false, error: 'Please provide customer name, phone number, and PIN code.' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order items are required.' },
        { status: 400 }
      );
    }

    const subtotal = body.items.reduce(
      (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    const shippingFee = subtotal > 499 ? 0 : 79;
    const prepaidDiscount = body.paymentMethod === 'UPI' && subtotal >= 499 ? 70 : 0;
    const finalTotal = Math.max(0, subtotal + shippingFee - prepaidDiscount);

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail || `${body.customerPhone}@customer.goodfinds.store`,
        customerPhone: body.customerPhone,
        houseName: body.houseName || '',
        streetAddress: body.streetAddress || '',
        landmark: body.landmark || '',
        city: body.city || body.district || 'City',
        district: body.district || body.city || 'Region',
        state: body.state || '',
        pincode: body.pincode,
        paymentMethod: body.paymentMethod === 'UPI' ? 'UPI' : 'COD',
        paymentStatus: body.paymentMethod === 'UPI' ? 'PAID' : 'PENDING',
        prepaidDiscount,
        total: finalTotal,
        status: body.paymentMethod === 'UPI' ? 'CONFIRMED' : 'PENDING',
        fulfillmentStatus: 'PENDING_SUPPLIER',
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId || item.id,
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: `ORD-${order.id.slice(-6).toUpperCase()}`,
      order,
    });
  } catch (error: any) {
    console.error('API create order error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
