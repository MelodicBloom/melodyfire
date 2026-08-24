import type { ButtonHTMLAttributes, MouseEvent } from 'react';

const PENDING_SECTION_KEY = 'melodyfire:pending-section';

export function scrollToSection(sectionId: string): boolean {
  const target = document.getElementById(sectionId);
  if (!target) return false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  const hadTabIndex = target.hasAttribute('tabindex');
  if (!hadTabIndex) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  return true;
}

export function queueSectionJump(sectionId: string) {
  sessionStorage.setItem(PENDING_SECTION_KEY, sectionId);
}

export function consumePendingSectionJump() {
  const sectionId = sessionStorage.getItem(PENDING_SECTION_KEY);
  if (!sectionId) return;
  sessionStorage.removeItem(PENDING_SECTION_KEY);
  requestAnimationFrame(() => scrollToSection(sectionId));
}

type SectionJumpProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> & {
  targetId: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function SectionJump({ targetId, onClick, style, ...props }: SectionJumpProps) {
  return <button type="button" {...props} style={{ border: 0, cursor: 'pointer', font: 'inherit', ...style }} onClick={(event) => {
    onClick?.(event);
    if (!event.defaultPrevented) scrollToSection(targetId);
  }} />;
}
