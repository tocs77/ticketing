import mongoose, { Model, HydratedDocument } from 'mongoose';

interface Payment {
  id?: string;
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends Model<Payment> {
  build(attrs: Payment): Promise<HydratedDocument<Payment>>;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.static('build', async function build(attrs: Payment) {
  return await this.create({ _id: attrs.id, ...attrs });
});

const Payment = mongoose.model<Payment, PaymentModel>('Payment', paymentSchema);

export { Payment };
