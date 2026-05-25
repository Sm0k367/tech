
interface CFImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function CFImage({ src, alt, className = "" }: CFImageProps) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
    />
  );
}
