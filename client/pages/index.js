import { buildClient } from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return <h2>{currentUser ? 'Hello! You are signed in' : 'Please login'}</h2>;
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);

  try {
    const { data } = await client.get(`/api/users/currentuser`);
    return data;
  } catch (error) {
    console.log('Error in axios init', error);
    return { error };
  }
};

export default LandingPage;
