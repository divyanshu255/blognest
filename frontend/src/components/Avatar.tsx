import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  firstName: string;
  lastName: string;
}

export default function Avatar({ src, alt, size = 'md', firstName, lastName }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-xs',
    lg: 'w-8 h-8 text-sm'
  };

  const sizePixels = {
    sm: 16,
    md: 20,
    lg: 32
  };

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={sizePixels[size]}
        height={sizePixels[size]}
        className={`rounded-full object-cover ${sizeClasses[size]}`}
      />
    );
  }

  return (
    <div className={`bg-gray-300 rounded-full flex items-center justify-center ${sizeClasses[size]}`}>
      <span className="text-gray-600 font-medium">
        {firstName[0]}{lastName[0]}
      </span>
    </div>
  );
} 