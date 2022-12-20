import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/signup', { email, password });
      console.log(response);
      setEmail('');
      setPassword('');
    } catch (error) {
      setErrors(error.response.data.errors);
    }
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
          {errors.length > 0 && (
            <div className='alert alert-danger mt-3'>
              {errors.map((err) => (
                <div className='text-danger' key={err.field}>
                  {err.message}
                </div>
              ))}
            </div>
          )}

          <button className='btn btn-primary mt-2'>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
