import Image from 'next/image';
import Matcha from '@/images/Matcha.png';
import Cup from '@/images/cup.png';

const Logo = () => {
  return (
    <>
      <Image className="mx-auto" src={Cup} width={250} height={250} alt="cup" />
      <Image
        className="absolute left-[20px] top-[80px] mx-auto"
        src={Matcha}
        priority
        width={350}
        height={200}
        alt="logo"
      />
    </>
  );
};

export default Logo;
