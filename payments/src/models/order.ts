import mongoose, { Model, HydratedDocument } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@tocstick/common';

interface Order {
  id?: string;
  status: OrderStatus;
  userId: string;
  price: number;
  version?: number;
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
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.static('build', async function build(attrs: Order) {
  return await this.create({ _id: attrs.id, ...attrs });
});

const Order = mongoose.model<Order, OrderModel>('Order', orderSchema);

export { Order };
