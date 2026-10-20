import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'ghost' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-semibold transition duration-micro ease-micro active:scale-[0.98] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50';

const VARIANTS: Record<Variant, string> = {
  // Solid cobalt; white text passes AA on it in both themes.
  primary: 'bg-cobalt text-white hover:brightness-110',
  ghost: 'border border-line bg-transparent text-ink hover:bg-ink/[0.06]',
  quiet: 'bg-transparent text-ink/80 hover:bg-ink/[0.06] hover:text-ink',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-[15px]',
  lg: 'h-12 px-6 text-base',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', type = 'button', ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...rest} />;
});

export function ButtonLink({ variant = 'primary', size = 'md', className = '', ...rest }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />;
}
