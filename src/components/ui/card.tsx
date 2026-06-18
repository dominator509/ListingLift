import type { ReactNode } from 'react';
import clsx from 'clsx';

export type CardProps = {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
};

export function Card({ children, className, title, description, footer }: CardProps) {
  return (
    <section className={clsx('rounded-2xl border border-slate-200 bg-white p-6 shadow-sm', className)}>
      {title || description ? (
        <div className="mb-4">
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? <CardText>{description}</CardText> : null}
        </div>
      ) : null}
      {children}
      {footer ? <div className="mt-6 border-t border-slate-100 pt-4">{footer}</div> : null}
    </section>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('mb-4 space-y-1', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={clsx('text-lg font-semibold text-slate-950', className)}>{children}</h3>;
}

export function CardText({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx('mt-2 text-sm leading-6 text-slate-600', className)}>{children}</p>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('space-y-4', className)}>{children}</div>;
}
