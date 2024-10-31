import clsx from 'clsx'
import Link from "next/link"
import { Container } from "./Container"
import { Logo, Logomark } from "./Logo"

export function Header({
  invert = false,
}: {

  invert?: boolean
}) {

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Link
          href="https://mawatech.com.br"
          aria-label="Home"

        >
          <Logomark
            className="h-8 sm:hidden"
            invert={invert}
          />
          <Logo
            className="hidden h-8 items-center gap-2 sm:flex"
            invert={invert}
          />
        </Link>
        <div className="flex items-center gap-x-8">
          <Button href="https://mawatech.com.br/contact" invert={invert}>
            Entre em contato
          </Button>
        </div>
      </div>
    </Container>
  )
}

type ButtonProps = {
  invert?: boolean
} & (
    | React.ComponentPropsWithoutRef<typeof Link>
    | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  )

export function Button({
  invert = false,
  className,
  children,
  ...props
}: ButtonProps) {
  className = clsx(
    className,
    'inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition',
    invert
      ? 'bg-white text-neutral-950 hover:bg-neutral-200'
      : 'bg-neutral-950 text-white hover:bg-neutral-800',
  )

  const inner = <span className="relative top-px">{children}</span>

  if (typeof props.href === 'undefined') {
    return (
      <button className={className} {...props}>
        {inner}
      </button>
    )
  }

  return (
    <Link className={className} {...props}>
      {inner}
    </Link>
  )
}
