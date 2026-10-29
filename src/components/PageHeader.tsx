import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <section className="pt-28 pb-10 sm:pt-32">
      <div className="container-page">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-terracota-500 animate-fade-in">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-tinta-800 text-balance sm:text-5xl animate-fade-up">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-tinta-500 sm:text-lg animate-fade-up">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  linkTo?: string;
  linkLabel?: string;
}

export function SectionHeading({ eyebrow, title, description, linkTo, linkLabel }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-terracota-500">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-tinta-800 sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-tinta-500 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-terracota-600 transition-colors hover:text-terracota-700 sm:flex"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
