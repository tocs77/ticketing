import { useEffect } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/use-request';

const Signout = () => {
  const [signoutRequest, signoutError] = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      Router.push('/');
    },
  });

  useEffect(() => {
    signoutRequest();
  }, []);
  return (
    <div>
      Signing you out...<div>{signoutError}</div>
    </div>
  );
};

export default Signout;
