import { StaticImageData } from "next/image"
import { FC, createRef, useEffect, useState } from "react";

interface FloatingImageProps {
    src: string;
}

const FloatingImage: FC<FloatingImageProps> = ({ src }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updatePosition = () => {
            const x = Math.random() * (window.innerWidth - imgRef.current.offsetWidth);
            const y = Math.random() * (window.innerHeight - imgRef.current.offsetHeight);
            setPosition({ x, y });
        };

        const intervalId = setInterval(updatePosition, 2000);
        updatePosition();

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const imgRef = createRef<HTMLImageElement>();

    return (
        <img
            ref={imgRef}
            src={src}
            alt="Floating Image"
            className="floating-image"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        />
    );
}

export default FloatingImage;
