import { useState } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/use-request';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signupRequest, signupError] = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => {
      Router.push('/');
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();
    signupRequest();
  };

  return (
    <div className='panel panel-default container'>
      <div className='panel-body'>
        <form onSubmit={submitHandler}>
          <h1 className='panel-heading'>Sign Up</h1>
          <div className='form-group'>
            <label>Email Address</label>
            <input className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input type='password' className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {signupError}
          <button className='btn btn-primary mt-2'>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
