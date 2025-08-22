import { useEffect, useRef, useState } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
}

const LazySection: React.FC<LazySectionProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // dispara apenas uma vez
        }
      },
      { threshold: 0.2 } // 20% da seção visível
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? "animate" : ""}`}
    >
      {children}
    </div>
  );
};

export default LazySection;
