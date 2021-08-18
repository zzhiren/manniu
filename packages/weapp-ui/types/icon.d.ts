import { ComponentClass } from 'react'
import { CommonEventFunction } from '@tarojs/components/types/common'

import MnComponent, { MnIconBaseProps } from './base'

export interface MnIconProps extends MnComponent, MnIconBaseProps {
  onClick?: CommonEventFunction
}

declare const MnIcon: ComponentClass<MnIconProps>

export default MnIcon
