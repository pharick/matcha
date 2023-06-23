import Matcha from '@/images/Matcha.png';
import Image from 'next/image';
import Cup from '@/images/cup.png';

const Header = () => {
  return (
    <header className="flex">
      <Image src={Matcha} width={100} priority alt="logo" />
      <Image src={Cup} width={80} alt="cup" />
    </header>
  );
};

export default Header;
