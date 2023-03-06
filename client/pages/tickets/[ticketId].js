import { useRequest } from '../../hooks/use-request';

const TicketInfo = ({ ticket }) => {
  const [createOrderRequest, createOrderError] = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) => {
      console.log('Did order', order);
    },
  });
  return (
    <div>
      <h2>{ticket.title}</h2>
      <h4>Price: ${ticket.price}</h4>
      <button className='btn btn-primary' onClick={createOrderRequest}>
        Purchase
      </button>
      {createOrderError}
    </div>
  );
};

TicketInfo.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  console.log(context.query);
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketInfo;
