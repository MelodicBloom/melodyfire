import type { ButtonHTMLAttributes, MouseEvent } from 'react';

const PENDING_SECTION_KEY = 'melodyfire:pending-section';
let memoryPendingSection: string | null = null;

function readPendingSection(): string | null {
  try {
    return sessionStorage.getItem(PENDING_SECTION_KEY) ?? memoryPendingSection;
  } catch {
    return memoryPendingSection;
  }
}

function clearPendingSection() {
  memoryPendingSection = null;
  try {
    sessionStorage.removeItem(PENDING_SECTION_KEY);
  } catch {
    // Storage may be unavailable in embedded contexts; memory state is sufficient.
  }
}

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
  memoryPendingSection = sectionId;
  try {
    sessionStorage.setItem(PENDING_SECTION_KEY, sectionId);
  } catch {
    // Keep the pending jump in memory when Web Storage is unavailable.
  }
}

export function consumePendingSectionJump() {
  const sectionId = readPendingSection();
  if (!sectionId) return;
  clearPendingSection();
  requestAnimationFrame(() => scrollToSection(sectionId));
}

type SectionJumpProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> & {
  targetId: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function SectionJump({ targetId, onClick, style, ...props }: SectionJumpProps) {
  return <button type="button" {...props} style={{ cursor: 'pointer', ...style }} onClick={(event) => {
    onClick?.(event);
    if (!event.defaultPrevented) scrollToSection(targetId);
  }} />;
}
