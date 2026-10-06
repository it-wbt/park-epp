'use client';

import {useEffect, useRef} from 'react';
import {usePathname} from 'next/navigation';

const revealSelector = [
  '[data-reveal]',
  '.section-heading',
  '.park-intro > div',
  '.park-stats > div',
  '.park-material-grid > a',
  '.solution-grid > a',
  '.process-grid > div',
  '.article-grid > a',
  '.park-technical-copy > a',
  '.park-download',
  '.contact-grid > aside',
  '.contact-grid > form',
].join(',');

/** Motion is an enhancement: nothing is hidden while waiting for JavaScript. */
export default function SiteMotion() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Map<Element, Animation>();
    const revealed = new Set<Element>();
    const candidates = Array.from(main.querySelectorAll<HTMLElement>(revealSelector));
    const candidateSet = new Set<Element>(candidates);
    // Reveal the outermost target only; nested reveals compound their movement.
    const targets = candidates.filter((target) => {
      for (let parent = target.parentElement; parent && parent !== main; parent = parent.parentElement) {
        if (candidateSet.has(parent)) return false;
      }
      return !target.closest('.park-hero');
    });
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let scrollRange = 0;

    const finish = (target: Element) => {
      animations.get(target)?.cancel();
      animations.delete(target);
      revealed.add(target);
      observer?.unobserve(target);
    };

    const animate = (target: HTMLElement, delay = 0, distance = 18) => {
      if (revealed.has(target)) return;
      revealed.add(target);
      observer?.unobserve(target);
      if (preference.matches || typeof target.animate !== 'function' || target.contains(document.activeElement)) return;

      // The independent translate property leaves card hover transforms intact.
      // No forwards fill or inline styles: the element returns to its own CSS.
      const animation = target.animate([
        {opacity: 0.16, translate: `0 ${distance}px`},
        {opacity: 1, translate: '0 0'},
      ], {duration: 520, delay, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'backwards'});
      animations.set(target, animation);
      animation.onfinish = () => finish(target);
    };

    const startReveals = () => {
      if (preference.matches || !('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver((entries) => {
        entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
          .forEach((entry, index) => animate(entry.target as HTMLElement, Math.min(index, 3) * 55));
      }, {threshold: 0, rootMargin: '0px 0px -32px 0px'});
      targets.forEach((target) => {
        if (!revealed.has(target)) observer?.observe(target);
      });
    };

    const updateProgress = () => {
      frame = 0;
      const progress = progressRef.current;
      if (!progress) return;
      const value = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;
      progress.style.transform = `scaleX(${value})`;
    };
    const requestProgress = () => {
      if (!frame && !preference.matches) frame = window.requestAnimationFrame(updateProgress);
    };
    const measure = () => {
      scrollRange = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      requestProgress();
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const focused = event.target;
      targets.forEach((target) => {
        if (target === focused || target.contains(focused)) finish(target);
      });
      animations.forEach((_animation, target) => {
        if (target === focused || target.contains(focused)) finish(target);
      });
    };
    const onPreferenceChange = () => {
      observer?.disconnect();
      animations.forEach((_animation, target) => finish(target));
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      if (progressRef.current) progressRef.current.style.transform = 'scaleX(0)';
      startReveals();
      measure();
    };

    startReveals();
    // A small entrance for the opening copy; skip it when restoring a scrolled page.
    if (!preference.matches && window.scrollY < 80 && 'IntersectionObserver' in window) {
      main.querySelectorAll<HTMLElement>('.park-hero-content > *').forEach((target, index) => {
        animate(target, Math.min(index, 3) * 60, 12);
      });
    }
    measure();
    window.addEventListener('scroll', requestProgress, {passive: true});
    window.addEventListener('resize', measure, {passive: true});
    document.addEventListener('focusin', onFocus);
    preference.addEventListener('change', onPreferenceChange);
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : undefined;
    resizeObserver?.observe(document.body);

    return () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', requestProgress);
      window.removeEventListener('resize', measure);
      document.removeEventListener('focusin', onFocus);
      preference.removeEventListener('change', onPreferenceChange);
      if (frame) window.cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      if (progressRef.current) progressRef.current.style.transform = 'scaleX(0)';
    };
  }, [pathname]);

  return <div ref={progressRef} className="site-scroll-progress" aria-hidden="true"/>;
}
