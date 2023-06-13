import Image from 'next/image';
import Matcha from '@/images/Matcha.png';
import Cup from '@/images/cup.png';
import LogIn from './LogIn';
import Leafs from '@/images/leafs.png';
// import LeafTop from '@/components/LeafTop';

const Home = () => {
  return (
    <>
      {/* <LeafTop /> */}
      <div className="relative mx-auto w-[350px]">
        <Image
          className="mx-auto mt-[70px]"
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
      </div>
      <LogIn />
      <Image
        className="absolute left-0 right-0 top-0 -z-10 h-full w-full"
        src={Leafs}
        alt="background leafs"
      />
    </>
  );
};

export default Home;
