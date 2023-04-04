import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    currentUser && { label: 'Sell Ticket', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders/' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
  ]
    .filter((linkConfig) => linkConfig)
    .map((link) => (
      <li key={link.href} className='nav-item'>
        <Link href={link.href} className='nav-link'>
          {link.label}
        </Link>
      </li>
    ));

  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/' className='navbar-brand'>
        Ttick
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
