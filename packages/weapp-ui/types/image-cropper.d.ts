import { ComponentClass } from 'react'
import MnComponent from './base'

export interface MnImageCropperStates {
  canvasId: string
  imagePath: string
  canvasImage: string
  originalImageWidth: number
  originalImageHeight: number
  imageWidth: number
  imageHeight: number
  imageLeft: number
  imageTop: number
  scale: number
  minScale: number
  canvasWidth: number
  canvasHeight: number
  /**
   * 裁剪框离顶部距离
   */
  cutBoxTop: number
  /**
   * 裁剪框离底部距离
   */
  cutBoxBottom: number
  /**
   * 裁剪框离左边距离
   *  @default 0
   */
  cutBoxLeft: number
  /**
   * 裁剪框离右边边距离
   * @default 0
   */
  cutBoxRight: number
  /**
   * 裁剪框宽度
   */
  cutBoxWidth: number
  /**
   * 裁剪框高度度
   */
  cutBoxHeight: number
}

export interface MnImageCropperProps extends MnComponent {
  /**
   * 图片地址
   */
  imagePath: string
  /**
   * 裁剪框大小
   */
  size: string | number
  success: (res) => void
  // fail?: (err) => void
  // cancel?: () => void
}

export interface TouchImageRelative {
  x: number
  y: number
}

declare const MnImageCropper: ComponentClass<MnImageCropperProps>

export default MnImageCropper
