import { CSSProperties } from 'react'

export interface MnComponent {
  className?: string

  customStyle?: string | CSSProperties
}

export interface MnIconBaseProps2 extends MnComponent {
  value: string

  color?: string
}

export interface MnIconBaseProps extends MnComponent {
  value: string

  color?: string

  prefixClass?: string

  size?: number | string
}

export default MnComponent
