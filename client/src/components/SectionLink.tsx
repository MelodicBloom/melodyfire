import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useLocation } from 'wouter';

type SectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  targetId: string;
};

export function SectionLink({ targetId, onClick, children, ...props }: SectionLinkProps) {
  const [location] = useLocation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();

    const target = document.getElementById(targetId);
    if (!target) return;

    const hadTabIndex = target.hasAttribute('tabindex');
    if (!hadTabIndex) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    if (!hadTabIndex) {
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
  };

  return (
    <a href={`#${location}`} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
