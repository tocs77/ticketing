import mongoose, { Model, HydratedDocument } from 'mongoose';
import { OrderStatus } from '@tocstick/common';
import { Order } from './order';

export interface ITicket {
  id?: string;
  title: string;
  price: number;
  isReserved?(): Promise<boolean>;
}

interface TicketModel extends Model<ITicket> {
  build(attrs: ITicket): Promise<HydratedDocument<ITicket>>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

ticketSchema.static('build', async function build(attrs: ITicket) {
  return await this.create(attrs);
});

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: { $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Cancelled] },
  });
  return existingOrder ? true : false;
};

const Ticket = mongoose.model<ITicket, TicketModel>('Ticket', ticketSchema);

export { Ticket };
