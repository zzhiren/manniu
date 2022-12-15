import { ComponentClass } from 'react'
import MnComponent from './base'

export interface FileItem {
  url: string
}

export interface OnAddFileItem {
  path: string
  name: string
  size: number
  originalFileObj?: {
    lastModified: number
    lastModifiedDate: string
    name: string
    size: number
    type: string
  }
}

interface SourceType {
  /** 聊天记录 */
  chat
  /** 从相册选图 */
  album
  /** 使用相机 */
  camera
  /** 使用前置摄像头(仅H5纯浏览器使用) */
  user
  /** 使用后置摄像头(仅H5纯浏览器) */
  environment
}

interface FileType {
  chat
  camera
  album
}

export interface MnFilePickerStates {
  isOpened: boolean;
}

export interface MnFilePickerProps extends MnComponent{
  /**
   * 文件数组对象，元素为对象，包含url（必选））
   */
  files: FileItem[]
  /**
   * OSS服务地址
   */
  action: string
  /**
   * 图片显示mode，对应 Image 标签的 mode 属性
   */
  imageMode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'
  /**
   * 是否显示文件名称
   * @default false
   */
  showName?: boolean
  /**
   * 是否显示添加图片按钮
   * @default true
   */
  showAdd?: boolean
  /**
   * 是否支持多选
   * @default false
   */
  multiple?: boolean
  /**
   * 单行的图片数量，不能为 0 或负数
   * @default 4
   */
  length?: number
  /**
   * 显示label的长度
   */
  nameLength?: number
  /**
   * 最多可以选择的图片张数
   * @since v2.0.2
   */
  count?: number
  /**
   * 所选的图片的尺寸
   * @since v2.0.2
   */
  sizeType?: string[]
  /**
   * 选择图片的来源
   * @since v2.0.2
   */
  sourceType?: string[]
  /**
   * 可选类型，支持聊天记录选择文件，相册选择，拍照上传
   * @default ['chat', ' camera', 'album']
   */
  fileType?: string[]
  /**
   * 是否显示删除按钮
   */
  showRemove?: boolean; // ，默认不显示，
  /**
   * 最大上传文件，单位: MB
   */
  size?: number;
  /**
   * 列间距
   */
  spacing?: number;
  /**
   * files 值发生变化触发的回调函数
   */
  onAdd: (files: OnAddFileItem[]) => void
  /**
   * 移除文件
   * @param idx - 文件下标
   */
  onRemove: (idx: number) => void
  /**
   * 点击文件触发回调
   */
  onFileClick?: (index: number, file: Record<string, any>) => void
  /**
   * 选择失败触发的回调
   * @param msg
   */
  onFail?: (msg: string) => void
}

declare const MnFilePicker: ComponentClass<MnFilePickerProps>

export default MnFilePicker
