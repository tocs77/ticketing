import mongoose, { Model, HydratedDocument } from 'mongoose';

import { OrderStatus } from '@tocstick/common';

interface Order {
  status: OrderStatus;
  userId: string;
  expiresAt: Date;
  //ticket: Ticket;
}

interface OrderModel extends Model<Order> {
  build(attrs: Order): Promise<HydratedDocument<Order>>;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.static('build', async function build(attrs: Order) {
  return await this.create(attrs);
});

const Order = mongoose.model<Order, OrderModel>('Order', orderSchema);

export { Order };
