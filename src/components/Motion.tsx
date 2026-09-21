/**
 * Tynde indpakninger om React Bits-komponenterne.
 *
 * Ingen af dem respekterer prefers-reduced-motion af sig selv, og det er et krav,
 * ikke pynt. Indpakningerne renderer indholdet helt uden animation naar brugeren
 * har slaaet bevaegelse fra i systemet.
 */
import React, { useEffect, useState } from 'react';
import BlurText from './BlurText';
import AnimatedContent from './AnimatedContent';
import ShinyText from './ShinyText';

function useReducedMotion(): boolean {
  // Start paa false, saa server-render og foerste klient-render er ens.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

type HeadingProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
};

export function Heading({ text, className = '', delay = 90, as = 'h1' }: HeadingProps) {
  const reduced = useReducedMotion();
  const Tag = as as React.ElementType;

  if (reduced) {
    return <Tag className={`${className} flex flex-wrap`}>{text}</Tag>;
  }

  return (
    <BlurText
      as={as}
      text={text}
      delay={delay}
      animateBy="words"
      direction="bottom"
      stepDuration={0.4}
      className={className}
    />
  );
}

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export function Reveal({ children, className = '', delay = 0, distance = 40 }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatedContent
      className={className}
      distance={distance}
      duration={0.9}
      ease="power3.out"
      threshold={0.15}
      delay={delay}
    >
      {children}
    </AnimatedContent>
  );
}

type BadgeProps = {
  text: string;
  className?: string;
  color?: string;
  shineColor?: string;
};

export function Badge({ text, className = '', color = '#9a9a9a', shineColor = '#0c0c0c' }: BadgeProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className} style={{ color }}>{text}</span>;
  }

  return <ShinyText text={text} className={className} color={color} shineColor={shineColor} speed={4} delay={1.5} />;
}
