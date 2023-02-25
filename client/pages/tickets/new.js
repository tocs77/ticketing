import { useState } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [createNewTicketRequest, errors] = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: (ticket) => {
      Router.push('/');
    },
  });

  const blurHandler = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    createNewTicketRequest();
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      {errors}
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label className='mb-2'>Title</label>
          <input className='form-control' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='form-group mt-3'>
          <label className='mb-2'>Price</label>
          <input className='form-control' value={price} onChange={(e) => setPrice(e.target.value)} onBlur={blurHandler} />
        </div>
        <button className='btn btn-primary mt-2'>Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
