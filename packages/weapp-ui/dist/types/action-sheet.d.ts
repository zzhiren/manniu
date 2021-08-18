import { MouseEvent, ComponentClass } from 'react'
import { CommonEvent } from '@tarojs/components/types/common'

import MnComponent from './base'

export interface MnActionSheetProps extends MnComponent {
  /**
   * 是否展示元素
   * @default false
   */
  isOpened: boolean
  /**
   * 元素的标题
   */
  title?: string
  /**
   * 取消按钮的内容
   */
  cancelText?: string
  /**
   * 元素被关闭触发的事件
   */
  onClose?: (event?: CommonEvent) => void
  /**
   * 点击了底部取消按钮触发的事件
   */
  onCancel?: (event?: CommonEvent) => void
}

export interface MnActionSheetState {
  _isOpened: boolean
}

export type MnActionSheetHeaderProps = MnComponent

export interface MnActionSheetFooterProps extends MnComponent {
  onClick?: Function
}

export type MnActionSheetBodyProps = MnComponent

export interface MnActionSheetItemProps extends MnComponent {
  /**
   * 点击 Item 触发的事件
   */
  onClick?: (event?: CommonEvent) => void
}

declare const MnActionSheetItem: ComponentClass<MnActionSheetItemProps>

declare const MnActionSheet: ComponentClass<MnActionSheetProps>

export default MnActionSheet

export { MnActionSheetItem }
