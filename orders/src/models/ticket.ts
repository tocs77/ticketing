import mongoose, { Model, HydratedDocument } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@tocstick/common';
import { Order } from './order';

export interface ITicket {
  id?: string;
  version?: number;
  title: string;
  price: number;
  isReserved?(): Promise<boolean>;
}

interface TicketModel extends Model<ITicket> {
  build(attrs: ITicket): Promise<HydratedDocument<ITicket>>;
  findByEvent(event: { id: string; version: number }): Promise<HydratedDocument<ITicket | null>>;
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.static('build', async function build(attrs: ITicket) {
  return await this.create({ title: attrs.title, price: attrs.price, _id: attrs.id });
});

ticketSchema.static('findByEvent', async function findByEvent(event: { id: string; version: number }) {
  return await Ticket.findOne({ _id: event.id, version: event.version - 1 });
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
