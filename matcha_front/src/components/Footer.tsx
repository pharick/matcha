import Link from 'next/link';
import { AiFillHeart } from 'react-icons/ai';

const Footer = () => {
  return (
    <footer className="bg-green-1/50 px-2 py-3 text-center">
      Made with <AiFillHeart color="#F39BB3" className="inline" /> by{' '}
      <Link
        className="font-bold underline hover:text-brown/80"
        href="https://profile.intra.42.fr/users/cbelva"
      >
        cbelva
      </Link>{' '}
      and{' '}
      <Link
        className="font-bold underline hover:text-brown/80"
        href="https://profile.intra.42.fr/users/cbelva"
      >
        cpasty
      </Link>
    </footer>
  );
};

export default Footer;
