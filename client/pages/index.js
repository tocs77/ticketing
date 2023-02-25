import Link from 'next/link';
import { buildClient } from '../api/build-client';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketsList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href={`/tickets/${ticket.id}`} className='navbar-brand'>
          View
        </Link>
      </td>
    </tr>
  ));
  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketsList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get(`/api/tickets`);
  return { tickets: data };
  // try {
  //   const { data } = await client.get(`/api/users/currentuser`);
  //   return data;
  // } catch (error) {
  //   console.log('Error in axios init', error);
  //   return { error };
  // }
};

export default LandingPage;
