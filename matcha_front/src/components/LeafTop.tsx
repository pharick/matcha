import Image from 'next/image';
import LeafFront from '@/images/leaf_front.png';
import styles from './LeafTop.module.scss';
import LeafSide from '@/images/leaf_side.png'

const LeafTop = () => {
  // const [position, setPosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   const updatePosition = () => {
  //   const x = Math.random() * window.innerWidth;
  //   const y = Math.random() * window.innerHeight;

  //     setPosition({ x, y });
  //   };

  //   const intervalId = setInterval(updatePosition, 2000);
  //   updatePosition();

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);


  return (
    <div className="absolute right-0 top-0 h-3/5 w-2/5">
      <div className={styles.leaf_top}>
        {/* <Image className={styles.leaf_front} src={LeafFront} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafFront} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafFront} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafFront} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafFront} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafSide} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafSide} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafSide} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafSide} alt="leaf" /> */}
      </div>
    </div>
  );
};

export default LeafTop;
