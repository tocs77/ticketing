import mongoose, { Model, HydratedDocument } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface Ticket {
  title: string;
  price: number;
  userId: string;
  version?: number;
  orderId?: string;
}

interface TicketModel extends Model<Ticket> {
  build(attrs: Ticket): Promise<HydratedDocument<Ticket>>;
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

ticketSchema.static('build', async function build(attrs: Ticket) {
  return await this.create(attrs);
});

const Ticket = mongoose.model<Ticket, TicketModel>('Ticket', ticketSchema);

export { Ticket };
