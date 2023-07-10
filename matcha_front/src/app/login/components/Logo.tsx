import Image from 'next/image';
import Matcha from '@/images/Matcha.png';
import Cup from '@/images/cup.png';

const Logo = () => {
  return (
    <div>
      <Image className="mx-auto" src={Cup} width={350} alt="cup" />
      <Image
        className="mt-[-110px] scale-150"
        src={Matcha}
        priority
        width={600}
        alt="logo"
      />
    </div>
  );
};

export default Logo;
