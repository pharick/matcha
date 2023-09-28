import Image, { StaticImageData } from 'next/image';
import Matcha from '@/images/Matcha.svg';
import Cup from '@/images/cup.svg';

const Logo = () => {
  return (
    <div>
      <Image
        className="mx-auto"
        src={Cup as StaticImageData}
        width={350}
        alt="cup"
      />
      <Image
        className="mt-[-110px] scale-150"
        src={Matcha as StaticImageData}
        width={600}
        alt="logo"
      />
    </div>
  );
};

export default Logo;
