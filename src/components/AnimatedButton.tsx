import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function AnimatedButton({ 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const timeline = gsap.timeline({ paused: true });
    timeline.to(button, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.out',
    });

    const handleMouseEnter = () => timeline.play();
    const handleMouseLeave = () => timeline.reverse();

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      timeline.kill();
    };
  }, []);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary/80';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/80';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-primary hover:bg-primary/80';
    }
  };

  return (
    <button
      ref={buttonRef}
      className={`w-full py-2 px-4 rounded-lg transition-colors ${getVariantClasses()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 