import { ComponentClass } from 'react'
import MnComponent from './base'

export interface MnCropperStates {
  showCropper: boolean
  imagePath: string
  stageLeft: number
  stageTop: number
  stageWidth: number
  stageHeight: number

  boxWidth: number
  boxHeight: number
  boxLeft: number
  boxTop: number

  canvasWidth: number
  canvasHeight: number
}

export interface MnCropperProps extends MnComponent {
  success: (res) => void
  fail?: (err) => void
  cancel?: () => void
}

declare const MnCropper: ComponentClass<MnCropperProps>

export default MnCropper
