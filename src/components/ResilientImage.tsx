import { useState } from 'react';
import { Scissors } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#29131D] via-[#1E0E15] to-[#14090E] border border-[#3B1D29] p-6 text-center ${className}`}
      >
        <Scissors className="w-7 h-7 text-[#F04E86]/80 mb-3" strokeWidth={1.25} />
        <span className="font-display text-lg text-[#FDF4F7]/85">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
