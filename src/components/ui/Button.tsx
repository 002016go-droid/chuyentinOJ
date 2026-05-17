import { ButtonHTMLAttributes, forwardRef } from 'react'
import { classNames } from '../../lib/utils'

type Variant = 'primary' | 'ghost' | 'danger'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', className, ...rest },
  ref,
) {
  const variantClass =
    variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-ghost'
  return <button ref={ref} className={classNames('btn', variantClass, className)} {...rest} />
})
