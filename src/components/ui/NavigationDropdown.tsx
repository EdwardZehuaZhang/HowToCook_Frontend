import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DotsThreeIcon } from '@/components/Icons';

interface NavigationDropdownProps {
  className?: string;
}

export const NavigationDropdown: React.FC<NavigationDropdownProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      label: 'Database mode',
      href: '/',
      isCurrent: pathname === '/',
      weight: pathname === '/' ? 'medium' : 'normal'
    },
    {
      label: 'AI mode',
      href: '/menu',
      isCurrent: pathname === '/menu',
      weight: pathname === '/menu' ? 'medium' : 'normal'
    }
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Three Dots Icon Button */}
      <button
        onClick={toggleDropdown}
        className={`relative flex items-center justify-center w-[36px] h-[36px] transition-all duration-200`}
        aria-label="Navigation menu"
      >
        {/* Background circle */}
        <div 
          className={`absolute rounded-full transition-all duration-200 w-[29px] h-[29px] ${
            isOpen 
              ? 'bg-muted' 
              : 'hover:bg-muted/50'
          }`}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-45%, -40%)'
          }}
        />
        <DotsThreeIcon 
          width={36} 
          height={36} 
          className="text-foreground relative z-10" 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 bg-background border border-solid border-foreground p-5 flex flex-col items-start gap-5 min-w-[160px] z-50">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative w-fit text-sm tracking-[0] leading-normal transition-colors hover:opacity-70 font-sans ${
                item.weight === 'medium' 
                  ? 'font-medium' 
                  : 'font-normal'
              } text-foreground`}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Separator */}
          <div className="relative self-stretch w-full h-px bg-foreground" />
          
          {/* Additional menu items */}
          <Link
            href="https://github.com/Anduin2017/HowToCook"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-fit font-sans font-normal text-foreground text-sm tracking-[0] leading-normal transition-colors hover:opacity-70"
          >
            HowToCook repo
          </Link>
          
          <Link
            href="https://edwardzehuazhang.framer.website/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-fit font-sans font-normal text-foreground text-sm tracking-[0] leading-normal transition-colors hover:opacity-70"
          >
            About me
          </Link>
        </div>
      )}
    </div>
  );
};
