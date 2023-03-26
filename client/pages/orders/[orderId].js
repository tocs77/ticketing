import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { stripeKey } from './stripeKey';
import { useRequest } from '../../hooks/use-request';

const OrderInfo = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const [paymentRequest, paymentError] = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: (payment) => {
      console.log('Success', payment);
    },
  });

  useEffect(() => {
    const msLeft = new Date(order.expiresAt) - new Date();
    setTimeLeft(msLeft);
    const interval = setInterval(() => setTimeLeft(new Date(order.expiresAt) - new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft < 0) return <div>Order expired</div>;

  const paymentCompleted = (id) => {
    console.log('Called payment with id', id);
    paymentRequest({ token: id });
  };

  return (
    <div>
      {(timeLeft / 1000).toFixed(0)} seconds before order expired
      <StripeCheckout
        token={({ id }) => paymentCompleted(id)}
        stripeKey={stripeKey}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {paymentError}
    </div>
  );
};

OrderInfo.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  console.log(context.query);
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};
export default OrderInfo;
