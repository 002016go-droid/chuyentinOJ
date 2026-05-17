import { HTMLAttributes, forwardRef } from 'react'
import { classNames } from '../../lib/utils'

interface Props extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, Props>(function Card(
  { hover, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={classNames('card', hover && 'card-hover', 'p-5', className)}
      {...rest}
    />
  )
})
