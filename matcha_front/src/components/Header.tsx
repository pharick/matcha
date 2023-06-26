import Matcha from '@/images/Matcha.png';
import Image from 'next/image';
import Cup from '@/images/cup.png';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="align-center flex">
      <Image src={Matcha} width={100} priority alt="logo" />
      <Image src={Cup} width={80} alt="cup" />
      <Link href="">header</Link>
    </header>
  );
};

export default Header;
