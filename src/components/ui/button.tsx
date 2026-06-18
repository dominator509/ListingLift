import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type SharedProps = { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; className?: string };

type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;

type LinkButtonProps = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const styles = {
  primary: 'bg-blue-700 text-white hover:bg-blue-800',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800',
  ghost: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
};

const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition';

export function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  return <button className={clsx(base, styles[variant], className)} {...props}>{children}</button>;
}

export function LinkButton({ children, variant = 'primary', className, href, ...props }: LinkButtonProps) {
  return <a href={href} className={clsx(base, styles[variant], className)} {...props}>{children}</a>;
}
