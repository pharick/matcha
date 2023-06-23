import Image from 'next/image';
import LeafFront from '@/images/leaf_front.png';
import styles from './LeafTop.module.scss';

const LeafTop = () => {
  return (
    <div className="absolute right-0 top-0 h-3/5 w-2/5">
      <div className={styles.leaf_top}>
        <Image className={styles.leaf_front} src={LeafFront} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafFront} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafFront} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafFront} alt="leaf" />
        <Image className={styles.leaf_front} src={LeafFront} alt="leaf" />
      </div>
    </div>
  );
};

export default LeafTop;
