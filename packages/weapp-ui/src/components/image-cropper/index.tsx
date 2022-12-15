import React from 'react'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import {View, Canvas, Image, ITouchEvent} from '@tarojs/components'
import MnIcon from '../icon'
import { MnImageCropperProps, MnImageCropperStates, TouchImageRelative } from '../../../types/image-cropper'
import { CommonEventFunction } from "@tarojs/components/types/common";

export default class MnImageCropper extends React.Component<MnImageCropperProps, MnImageCropperStates> {
  public static defaultProps: MnImageCropperProps
  public static propTypes: InferProps<MnImageCropperProps>

  public constructor(props: MnImageCropperProps) {
    super(props);
    this.state = {
      canvasId: 'mn-image-cropper__image',
      imagePath: '',
      canvasImage: '',
      scale: 1,
      minScale: 1,
      originalImageWidth: 0,
      originalImageHeight: 0,
      imageWidth: 0,
      imageHeight: 0,
      imageLeft: 0,
      imageTop: 0,
      cutBoxWidth: 0,
      cutBoxHeight: 0,
      cutBoxTop: 0,
      cutBoxBottom: 0,
      cutBoxLeft: 0,
      cutBoxRight: 0,
      canvasWidth: 400,
      canvasHeight: 400
    }
  }


  /* 系统信息 */
  private systemInfo: Taro.getSystemInfoSync.Result = Taro.getSystemInfoSync()
  /* canvas实例 */
  private canvasContext: Taro.CanvasContext
  /* 是否结束触摸 */
  private endTouch: boolean = true
  /* 鼠标和图片中心的相对位置 */
  private touchImageRelative: TouchImageRelative[] = []
  /* 双指触摸时斜边长度 */
  private hypotenuseLength: number = 0
  /* canvas 是否在屏幕可视范围外 */
  private canvasOverflow: boolean = true
  /* setCenter timer */
  private setCenterTimer: any = null
  private localPath: string = ''

  public async componentDidMount() {
    await this.init(this.props.imagePath)
  }

  /**
   * @desc 初始化
   * @private
   */
  private init = async (imagePath: string) => {
    console.log('systemInfo', this.systemInfo)
    this.setState({
      imagePath: imagePath
    })
    await this.computeCutBoxSize()
    imagePath && this.initImageSize(imagePath)
    this.initCanvas()
  }

  /**
   * @desc 初始化图片size
   * @param src
   */
  private initImageSize = (src?: string): void => {
    const { windowWidth, windowHeight } = this.systemInfo
    const { cutBoxWidth, scale, imagePath } = this.state
    Taro.getImageInfo({
      src: src ? src : imagePath
    }).then(async (res) => {
      let width: number
      let height: number
      let minScale: number
      /* 图片高度/图片宽度 = 可视区域高度/可视区域宽度 */
      /* 可视区域宽度 = 可视区域高度 * 图片宽度 / 图片高度 */
      /* width = windowHeight * res.width / res.height */
      if (res.height > res.width) {
        width = windowHeight * res.width / res.height;
        height = windowHeight
        minScale = cutBoxWidth / width
      } else {
        width = windowWidth;
        height = windowWidth * res.height /res.width;
        minScale = cutBoxWidth / height
      }


      this.localPath = res.path
      await this.setState({
        originalImageWidth: width,
        originalImageHeight: height,
        imageWidth: width * scale,
        imageHeight: height * scale,
        canvasHeight: height,
        canvasWidth: width,
        minScale
      })

      this.setCenter()
    })
  }

  /**
   * @desc 初始化canvas
   */
  private initCanvas = (): void => {
    if (!this.canvasContext) this.canvasContext = Taro.createCanvasContext(this.state.canvasId, this)
  }


  /**
   * @desc 居中
   */
  private setCenter = (): void => {
    const { windowWidth, windowHeight } = this.systemInfo
    const { imageWidth, imageHeight } = this.state
    this.setState({
      imageTop: (windowHeight - imageHeight) / 2,
      imageLeft: (windowWidth - imageWidth) / 2,
    })
  }

  /**
   * @desc 重置图片位置和大小
   */
  private refresh = (): void => {
    const { originalImageWidth, originalImageHeight } = this.state
    this.setState({
      imageWidth: originalImageWidth,
      imageHeight: originalImageHeight,
      scale: 1
    }, () => {
      this.setCenter()
    })
  }

  /**
   * @desc 预览剪裁的图片
   */
  private previewImage = async () => {
    await this.draw()
    await this.generateImage()
    Taro.previewImage({
      current: this.state.canvasImage,
      urls: [this.state.canvasImage]
    }).then(res => {

    }).catch(err => {
      console.log(err)
    })
  }

  /**
   * @desc 选择本地图片剪裁
   */
  private chooseImage = (): void => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    }).then(res => {
      console.log(res)
      this.setState({
        imagePath: res.tempFilePaths[0]
      }, () => {
        this.initImageSize(res.tempFilePaths[0])
      })
    })
  }

  /**
   * @desc 渲染canvas
   * @private
   */
  private draw = async (): Promise<boolean> => {
    /* 计算缩放后的图片宽高差 */
    return new Promise((resolve, reject) => {
      const {
        scale,
        imageLeft,
        imageTop,
        imageWidth,
        imageHeight,
        cutBoxLeft,
        cutBoxTop,
      } = this.state
      const differenceWidth = imageWidth * scale -imageWidth
      const differenceHeight = imageHeight * scale - imageHeight

      const xPos = imageLeft - differenceWidth / 2 - cutBoxLeft
      const yPos = imageTop - differenceHeight / 2 - cutBoxTop
      this.canvasContext.drawImage(this.localPath, xPos, yPos, imageWidth * scale, imageHeight * scale)
      this.canvasContext.draw(false, () => {
        /* 生成图片 */
        resolve(true)
      })
    })
  }

  /**
   * @desc canvas生成图片
   */
  private generateImage = async (success: boolean = false): Promise<Taro.canvasToTempFilePath.SuccessCallbackResult> => {
    const { cutBoxWidth, cutBoxHeight, canvasId } = this.state
    const { pixelRatio } = this.systemInfo
    return new Promise((resolve, reject) => {
      Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: cutBoxWidth,
        height: cutBoxHeight,
        destWidth: cutBoxWidth * pixelRatio,
        destHeight: cutBoxHeight * pixelRatio,
        canvasId: canvasId
      }).then(res => {
        console.log(res.tempFilePath)
        if (success) {
          this.props.success && this.props.success(res.tempFilePath)
        }
        this.setState({
          canvasImage: res.tempFilePath
        }, () => {
          resolve(res)
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * @desc 计算裁剪框的宽高
   */
  private computeCutBoxSize = async () =>  {
    const { windowWidth, windowHeight } = this.systemInfo
    const { size } = this.props
    let width: number = 0
    if (typeof size === 'string' && size.indexOf('%')) {
      width = windowWidth * (Number(size.replace('%', '')) / 100)
    }
    return new Promise((resolve, reject) => {
      this.setState({
        cutBoxWidth: width,
        cutBoxHeight: width,
        cutBoxTop: (windowHeight - width) / 2,
        cutBoxBottom: (windowHeight - width) / 2,
        cutBoxLeft: (windowWidth - width) / 2,
        cutBoxRight: (windowWidth - width) / 2
      }, () => {
        resolve(null)
      })
    })
  }

  /**
   * @desc 图片触摸事件开始监听
   * @param e
   */
  private imageOnTouchStart = (e: ITouchEvent): void => {
    this.endTouch = false
    const { imageWidth, imageHeight, scale } = this.state
    if (e.touches.length === 1) {
      /* 单指拖动 */
      let differenceWidth = imageWidth * scale -imageWidth
      let differenceHeight = imageHeight * scale - imageHeight

      this.touchImageRelative[0] = {
        x: e.touches[0].clientX - this.state.imageLeft + differenceWidth / 2,
        y: e.touches[0].clientY - this.state.imageTop + differenceHeight / 2,
      }
    } else {
      /* 双指放大 */
      /* 计算双指的 x y 轴坐标差 */
      const width: number = Math.abs(e.touches[0].clientX - e.touches[1].clientX)
      const height: number = Math.abs(e.touches[0].clientY - e.touches[1].clientY)
      this.touchImageRelative = [
        {
          x: e.touches[0].clientX - this.state.imageLeft,
          y: e.touches[0].clientY - this.state.imageTop
        },
        {
          x: e.touches[1].clientX - this.state.imageLeft,
          y: e.touches[1].clientY - this.state.imageTop
        }
      ]
      this.hypotenuseLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
    }

    !this.canvasOverflow && this.draw()
  }

  /**
   * @desc 图片触摸移动事件监听
   * @param e
   */
  private imageOnTouchMove = (e: ITouchEvent): void => {
    console.log('imageOnTouchMove')
    if (this.endTouch) return

    const {
      minScale
    } = this.state

    if (e.touches.length === 1) {
      /* 单指拖动 */
      let top: number = 0
      let left: number = 0
      top = e.touches[0].clientY - this.touchImageRelative[0].y
      left = e.touches[0].clientX - this.touchImageRelative[0].x
      this.imageEdgeDetection(top, left)
    } else {
      /* 双指缩放 */
      let width = (Math.abs(e.touches[0].clientX - e.touches[1].clientX))
      let height = (Math.abs(e.touches[0].clientY - e.touches[1].clientY))
      let hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
      let scale = this.state.scale * ((hypotenuse - 2) / this.hypotenuseLength)
      scale = scale < minScale ? minScale : scale
      this.setState({
        scale
      })
    }
  }

  /**
   * @desc 图片触摸事件结束监听
   */
  private imageOnTouchEnd = (): void => {
    this.endTouch = true
    this.moveStop()
  }

  /**
   * @desc 图片边缘检测
   * @param top - 手指与图片的垂直移动距离
   * @param left - 手指与图片的水平移动距离
   */
  private imageEdgeDetection = (top: number, left: number): void => {
    let {
      cutBoxTop,
      cutBoxLeft,
      cutBoxWidth,
      cutBoxHeight,
      imageHeight,
      imageWidth,
      scale
    } = this.state

    /* 计算缩放后的图片宽高差 */
    let differenceWidth = imageWidth * scale - imageWidth
    let differenceHeight = imageHeight * scale - imageHeight


    const imageTop: number = top > cutBoxTop ? cutBoxTop : (top + imageHeight * scale < cutBoxTop + cutBoxHeight) ? (cutBoxTop + cutBoxHeight) - imageHeight * scale : top
    const imageLeft: number = left > cutBoxLeft ? cutBoxLeft : (left + imageWidth * scale < cutBoxLeft + cutBoxWidth) ? (cutBoxLeft + cutBoxWidth) - imageWidth * scale : left
    this.setState({
      imageTop: imageTop + differenceHeight / 2,
      imageLeft: imageLeft + differenceWidth / 2,
    })
  }

  /**
   * @desc 停止移动
   */
  private moveStop = (): void => {
    if (this.touchImageRelative.length === 2) {
      clearTimeout(this.setCenterTimer)
      this.setCenterTimer = setTimeout(this.setCenter, 1000)
    }

    this.touchImageRelative = []
  }

  public render (): JSX.Element {
    const { windowWidth } = this.systemInfo
    const {
      canvasId,
      imagePath,
      scale,
      imageWidth,
      imageTop,
      imageLeft,
      imageHeight,
      cutBoxWidth,
      cutBoxHeight,
      cutBoxTop,
      cutBoxBottom,
      cutBoxLeft,
      cutBoxRight,
    } = this.state
    const {
      className
    } = this.props
    const rootClass = classNames('mn-image-cropper', className)
    const imageStyle = {
      width: `${imageWidth}px`,
      height: `${imageHeight}px`,
      top: `${imageTop}px`,
      left: `${imageLeft}px`,
      transform: `scale(${scale})`,
      transformOrigin: `center`
    }

    /* 裁剪框外层容器高度 */
    const contentCutWrapper = {
      height: `${cutBoxHeight}px`
    }

    /* 裁剪框样式 */
    const cutBoxStyle = {
      width: `${cutBoxWidth}px`,
      height: `${cutBoxHeight}px`,
    }

    /* 裁剪框顶部填充区月样式 */
    const contentTopFillStyle = {
      width: `${windowWidth}px`,
      height: `${cutBoxTop}px`,
      top: 0,
    }

    /* 裁剪框底部区域填充样式 */
    const contentBottomFillStyle = {
      width: `${windowWidth}px`,
      height: `${cutBoxBottom}px`,
      top: `${cutBoxTop + cutBoxHeight}px`
    }

    /* 裁剪框左侧区域填充样式 */
    const contentCutLeftFileStyle = {
      width: `${cutBoxLeft}px`,
      height: `${cutBoxHeight}px`,
      top: `${cutBoxTop}px`,
    }

    /* 裁剪框右侧区域填充样式 */
    const contentCutRightFileStyle = {
      width: `${cutBoxRight}px`,
      height: `${cutBoxHeight}px`,
      top: `${cutBoxTop}px`,
    }

    /* canvas画布样式 */
    const canvasStyle = {
      width: `${cutBoxWidth}px`,
      height: `${cutBoxHeight}px`,
      top: `-9999px`
    }

    return (
      <View className={rootClass}>
        <View className='mn-image-cropper__main'>
          <View className='mn-image-cropper__content'>
            <View className='mn-image-cropper__content-fill' style={contentTopFillStyle}/>

            <View className='mn-image-cropper__content-cut-wrapper' style={contentCutWrapper}>
              <View className='mn-image-cropper__content-cut-fill' style={contentCutLeftFileStyle}/>

              <View
                className='mn-image-cropper__content-cut-box'
                style={cutBoxStyle}
                onClick={this.previewImage}
              >
                <View className="border border-top-left"/>
                <View className="border border-top-right"/>
                <View className="border border-right-top"/>
                <View className="border border-right-bottom"/>
                <View className="border border-bottom-right"/>
                <View className="border border-bottom-left"/>
                <View className="border border-left-bottom"/>
                <View className="border border-left-top"/>
              </View>

              <View className='mn-image-cropper__content-cut-fill' style={contentCutRightFileStyle}/>
            </View>

            <View className='mn-image-cropper__content-fill' style={contentBottomFillStyle}/>

          </View>

          <Image
            className='mn-image-cropper__image'
            src={imagePath}
            style={imageStyle}
            onTouchStart={this.imageOnTouchStart}
            onTouchMove={this.imageOnTouchMove}
            onTouchEnd={this.imageOnTouchEnd}
          />
        </View>

        <Canvas
          canvasId={canvasId}
          className='mn-image-cropper__canvas'
          disableScroll={true}
          style={canvasStyle}
        />

        <View className='mn-image-cropper__action'>
          <View className='mn-image-cropper__mr-30' onClick={this.refresh}><MnIcon value='refresh' color='white' size={36}/></View>
          <View className='mn-image-cropper__mr-30' onClick={this.previewImage}><MnIcon value='preview' color='white' size={36}/></View>
          <View className='mn-image-cropper__mr-30' onClick={this.chooseImage}><MnIcon value='local-image' color='white' size={36}/></View>
          <View onClick={() => this.generateImage(true)}><MnIcon value='confirm' color='white' size={36}/></View>
        </View>
      </View>
    )
  }
}

MnImageCropper.defaultProps = {
  className: '',
  imagePath: '',
  size: '100%',
  success: (imagePath: string): void => {}
}

MnImageCropper.propTypes = {
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
}
