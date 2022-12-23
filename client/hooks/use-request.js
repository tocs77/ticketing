import { useState } from 'react';
import axios from 'axios';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errorElement, setErrorElement] = useState(null);

  const doRequest = async () => {
    setErrorElement(null);
    try {
      const response = await axios[method](url, body);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      setErrorElement(
        <div className='alert alert-danger mt-3'>
          {err.response.data.errors.map((err) => (
            <div className='text-danger' key={err.message}>
              {err.message}
            </div>
          ))}
        </div>
      );
    }
  };

  return [doRequest, errorElement];
};

export { useRequest };
