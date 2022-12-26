import mongoose, { Model, HydratedDocument } from 'mongoose';

interface Ticket {
  title: string;
  price: number;
  userId: string;
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

ticketSchema.static('build', async function build(attrs: Ticket) {
  return await this.create(attrs);
});

const Ticket = mongoose.model<Ticket, TicketModel>('Ticket', ticketSchema);

export { Ticket };
