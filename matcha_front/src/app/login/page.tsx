import Image from 'next/image';
import Matcha from '@/images/Matcha.png';
import Cup from '@/images/cup.png';
import LogIn from './LogIn';
import Leafs from '@/images/leafs.png';
import LeafTop from '@/components/LeafTop';

const Home = () => {
  return (
    <>
      {/* <LeafTop /> */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          className="mx-auto"
          src={Cup}
          width={250}
          height={250}
          alt="cup"
        />
        <Image
          className="absolute left-[20px] top-[80px] mx-auto"
          src={Matcha}
          width={350}
          height={200}
          alt="logo"
        />
        <LogIn />
      </div>
    </>
  );
};

export default Home;
