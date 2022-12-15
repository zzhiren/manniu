import React from 'react'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
// import PropTypes, { InferProps } from 'prop-types'
import { View, Image, Canvas, ITouchEvent } from '@tarojs/components'
import { MnCropperProps, MnCropperStates } from '../../../types/cropper'

// config
// const debug = false// 是否启用调试，默认值为false。true：打印过程日志；false：关闭过程日志
const outputFileType = 'jpg'// 目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
const quality = 1// 图片的质量。默认值为1，即最高质量。目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
let aspectRatio = 0// 目标图片的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0
//


// let layoutLeft = 0
// let layoutTop = 0
let layoutWidth = 0
let layoutHeight = 0

let stageLeft = 0
let stageTop = 0
let stageWidth = 0
let stageHeight = 0

let imageWidth = 0
let imageHeight = 0


const pixelRatio = 1// todo设备像素密度//暂不使用//

let imageStageRatio = 1// 图片实际尺寸与剪裁舞台大小的比值，用于尺寸换算。

let minBoxWidth = 0
let minBoxHeight = 0

// initial
let minBoxWidthRatio = 0.15// 最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
let minBoxHeightRatio = 0.15// 同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。

let initialBoxWidthRatio = 0.6// 剪裁框初始大小比率。默认值0.6，即剪裁框默认宽度为图片宽度的0.6倍。
let initialBoxHeightRatio = 0.6 // 同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
//


let touchStartBoxLeft = 0
let touchStartBoxTop = 0
let touchStartBoxWidth = 0
let touchStartBoxHeight = 0

let touchStartX = 0
let touchStartY = 0

export default class MnCropper extends React.Component<MnCropperProps, MnCropperStates> {
  public constructor (props: MnCropperProps) {
    super(props)
    this.state = {
      showCropper: false,

      imagePath: '',
      stageLeft: 0,
      stageTop: 0,
      stageWidth: 0,
      stageHeight: 0,

      boxWidth: 0,
      boxHeight: 0,
      boxLeft: 0,
      boxTop: 0,

      canvasWidth: 0,
      canvasHeight: 0
    }
  }

  public show = (): void => {
    this.setState({
      showCropper: true
    })
  }

  public hide = (): void => {
    this.setState({
      showCropper: false
    })
  }

  public init = (opts): void => {
    const imagePath = opts.imagePath
    this.setState({
      imagePath
    })

    // if (opts.debug) {
    //   debug = opts.debug;
    // }

    if (opts.minBoxWidthRatio) {
      minBoxWidthRatio = opts.minBoxWidthRatio
    }

    if (opts.minBoxHeightRatio) {
      minBoxHeightRatio = opts.minBoxHeightRatio
    }

    if (opts.initialBoxWidthRatio) {
      initialBoxWidthRatio = opts.initialBoxWidthRatio
    }

    if (opts.initialBoxHeightRatio) {
      initialBoxHeightRatio = opts.initialBoxHeightRatio
    }

    if (opts.aspectRatio) {
      aspectRatio = opts.aspectRatio
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this

    Taro.createSelectorQuery().select('.mn-cropper').boundingClientRect(function (rect) {
      // fnLog(rect);
      // layoutLeft = rect.left
      // layoutTop = rect.top
      layoutWidth = rect.width
      layoutHeight = rect.height
      Taro.getImageInfo({
        src: imagePath
      }).then(imageInfo => {
        // eslint-disable-next-line no-console
        console.log('imageInfo', imageInfo)
        /* 获取图片的原始宽高 */
        imageWidth = imageInfo.width
        imageHeight = imageInfo.height

        /* imageWH 图片的宽高比，layoutWH 容器的宽高比 */
        const imageWH = imageWidth / imageHeight
        const layoutWH = layoutWidth / layoutHeight
        /* 判断裁剪框的宽高 */
        if (imageWH >= layoutWH) {
          stageWidth = layoutWidth
          stageHeight = stageWidth / imageWH
          imageStageRatio = imageHeight / stageHeight
        } else {
          stageHeight = layoutHeight
          stageWidth = layoutHeight * imageWH
          imageStageRatio = imageWidth / stageWidth
        }
        stageLeft = (layoutWidth - stageWidth) / 2
        stageTop = (layoutHeight - stageHeight) / 2


        minBoxWidth = stageWidth * minBoxWidthRatio
        minBoxHeight = stageHeight * minBoxHeightRatio

        let boxWidth = stageWidth * initialBoxWidthRatio
        let boxHeight = stageHeight * initialBoxHeightRatio

        if (aspectRatio) {
          boxHeight = boxWidth / aspectRatio
        }
        if (boxHeight > stageHeight) {
          boxHeight = stageHeight
          boxWidth = boxHeight * aspectRatio
        }

        const boxLeft = (stageWidth - boxWidth) / 2
        const boxTop = (stageHeight - boxHeight) / 2


        context.setState({
          imagePath: imageInfo.path,
          canvasWidth: imageWidth * pixelRatio,
          canvasHeight: imageHeight * pixelRatio,

          stageLeft,
          stageTop,
          stageWidth,
          stageHeight,

          boxWidth,
          boxHeight,
          boxLeft,
          boxTop
        })
      }).catch(err => {
        context.props.fail && context.props.fail(err)
      })
    }).exec()
  }

  /**
   * @desc 手指触摸开始
   * @param e
   */
  private onTouchStart = (e: ITouchEvent): void => {
    const {
      boxLeft,
      boxTop,
      boxWidth,
      boxHeight
    } = this.state

    const touch = e.touches[0]
    const pageX = touch.pageX
    const pageY = touch.pageY

    touchStartX = pageX
    touchStartY = pageY

    touchStartBoxLeft = boxLeft
    touchStartBoxTop = boxTop
    touchStartBoxWidth = boxWidth
    touchStartBoxHeight = boxHeight
  }

  /**
   * @desc 手指触摸移动
   * @param e
   */
  private onTouchMove = (e: ITouchEvent): void => {
    const targetId = e.target.id
    const touch = e.touches[0]
    const pageX = touch.pageX
    const pageY = touch.pageY

    const offsetX = pageX - touchStartX
    let offsetY = pageY - touchStartY


    if (targetId === 'box') {
      let newBoxLeft = touchStartBoxLeft + offsetX
      let newBoxTop = touchStartBoxTop + offsetY

      if (newBoxLeft < 0) {
        newBoxLeft = 0
      }
      if (newBoxTop < 0) {
        newBoxTop = 0
      }
      if (newBoxLeft + touchStartBoxWidth > stageWidth) {
        newBoxLeft = stageWidth - touchStartBoxWidth
      }
      if (newBoxTop + touchStartBoxHeight > stageHeight) {
        newBoxTop = stageHeight - touchStartBoxHeight
      }
      this.setState({
        boxLeft: newBoxLeft,
        boxTop: newBoxTop
      })
    } else if (targetId === 'lt') {
      if (aspectRatio) {
        offsetY = offsetX / aspectRatio
      }

      let newBoxLeft = touchStartBoxLeft + offsetX
      let newBoxTop = touchStartBoxTop + offsetY

      if (newBoxLeft < 0) {
        newBoxLeft = 0
      }
      if (newBoxTop < 0) {
        newBoxTop = 0
      }

      if ((touchStartBoxLeft + touchStartBoxWidth - newBoxLeft) < minBoxWidth) {
        newBoxLeft = touchStartBoxLeft + touchStartBoxWidth - minBoxWidth
      }
      if ((touchStartBoxTop + touchStartBoxHeight - newBoxTop) < minBoxHeight) {
        newBoxTop = touchStartBoxTop + touchStartBoxHeight - minBoxHeight
      }

      let newBoxWidth = touchStartBoxWidth - (newBoxLeft - touchStartBoxLeft)
      let newBoxHeight = touchStartBoxHeight - (newBoxTop - touchStartBoxTop)


      // 约束比例
      if (newBoxTop === 0 && aspectRatio && newBoxLeft !== 0) {
        newBoxWidth = newBoxHeight * aspectRatio
        newBoxLeft = touchStartBoxWidth - newBoxWidth + touchStartBoxLeft
      }
      if (newBoxLeft === 0 && aspectRatio) {
        newBoxHeight = newBoxWidth / aspectRatio
        newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop
      }

      if (newBoxWidth === minBoxWidth && aspectRatio) {
        newBoxHeight = newBoxWidth / aspectRatio
        newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop
      }

      this.setState({
        boxTop: newBoxTop,
        boxLeft: newBoxLeft,
        boxWidth: newBoxWidth,
        boxHeight: newBoxHeight
      })
    } else if (targetId === 'rt') {
      if (aspectRatio) {
        offsetY = -offsetX / aspectRatio
      }


      let newBoxWidth = touchStartBoxWidth + offsetX
      if (newBoxWidth < minBoxWidth) {
        newBoxWidth = minBoxWidth
      }
      if (touchStartBoxLeft + newBoxWidth > stageWidth) {
        newBoxWidth = stageWidth - touchStartBoxLeft
      }


      let newBoxTop = touchStartBoxTop + offsetY

      if (newBoxTop < 0) {
        newBoxTop = 0
      }

      if ((touchStartBoxTop + touchStartBoxHeight - newBoxTop) < minBoxHeight) {
        newBoxTop = touchStartBoxTop + touchStartBoxHeight - minBoxHeight
      }
      let newBoxHeight = touchStartBoxHeight - (newBoxTop - touchStartBoxTop)


      // 约束比例
      if (newBoxTop === 0 && aspectRatio && newBoxWidth !== stageWidth - touchStartBoxLeft) {
        newBoxWidth = newBoxHeight * aspectRatio
      }

      if (newBoxWidth === stageWidth - touchStartBoxLeft && aspectRatio) {
        newBoxHeight = newBoxWidth / aspectRatio
        newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop
      }

      if (newBoxWidth === minBoxWidth && aspectRatio) {
        newBoxHeight = newBoxWidth / aspectRatio
        newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop
      }


      this.setState({
        boxTop: newBoxTop,
        boxHeight: newBoxHeight,
        boxWidth: newBoxWidth
      })
    } else if (targetId === 'lb') {
      if (aspectRatio) {
        offsetY = -offsetX / aspectRatio
      }
      let newBoxLeft = touchStartBoxLeft + offsetX

      if (newBoxLeft < 0) {
        newBoxLeft = 0
      }
      if ((touchStartBoxLeft + touchStartBoxWidth - newBoxLeft) < minBoxWidth) {
        newBoxLeft = touchStartBoxLeft + touchStartBoxWidth - minBoxWidth
      }

      let newBoxWidth = touchStartBoxWidth - (newBoxLeft - touchStartBoxLeft)


      let newBoxHeight = touchStartBoxHeight + offsetY
      if (newBoxHeight < minBoxHeight) {
        newBoxHeight = minBoxHeight
      }
      if (touchStartBoxTop + newBoxHeight > stageHeight) {
        newBoxHeight = stageHeight - touchStartBoxTop
      }

      // 约束比例
      if (newBoxHeight === stageHeight - touchStartBoxTop && aspectRatio && newBoxLeft !== 0) {
        newBoxWidth = newBoxHeight * aspectRatio
        newBoxLeft = touchStartBoxWidth - newBoxWidth + touchStartBoxLeft
      }
      if (newBoxLeft === 0 && aspectRatio) {
        newBoxHeight = newBoxWidth / aspectRatio
      }

      if (newBoxWidth === minBoxWidth && aspectRatio) {
        newBoxHeight = newBoxWidth / aspectRatio
      }


      this.setState({
        boxLeft: newBoxLeft,
        boxWidth: newBoxWidth,
        boxHeight: newBoxHeight
      })
    } else if (targetId === 'rb') {
      if (aspectRatio) {
        offsetY = offsetX / aspectRatio
      }
      let newBoxWidth = touchStartBoxWidth + offsetX
      if (newBoxWidth < minBoxWidth) {
        newBoxWidth = minBoxWidth
      }
      if (touchStartBoxLeft + newBoxWidth > stageWidth) {
        newBoxWidth = stageWidth - touchStartBoxLeft
      }

      let newBoxHeight = touchStartBoxHeight + offsetY
      if (newBoxHeight < minBoxHeight) {
        newBoxHeight = minBoxHeight
      }
      if (touchStartBoxTop + newBoxHeight > stageHeight) {
        newBoxHeight = stageHeight - touchStartBoxTop
      }


      // 约束比例
      if (newBoxHeight === stageHeight - touchStartBoxTop && aspectRatio && newBoxWidth !== stageWidth - touchStartBoxLeft) {
        newBoxWidth = newBoxHeight * aspectRatio
      }

      if (newBoxWidth === stageWidth - touchStartBoxLeft && aspectRatio) {
        newBoxHeight = newBoxWidth / aspectRatio
      }

      if (newBoxWidth === minBoxWidth && aspectRatio) {
        newBoxHeight = newBoxWidth / aspectRatio
      }


      this.setState({
        boxWidth: newBoxWidth,
        boxHeight: newBoxHeight
      })
    }
  }

  private onTouchEnd = (): void => {
    // fnLog('end')
  }

  private onTouchCancel = (): void => {
    // fnLog('cancel')
  }

  /**
   * @desc 确认剪裁
   */
  private handlerCrop = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    const { imagePath } = this.state
    const canvasContext: Taro.CanvasContext = Taro.createCanvasContext('cropper-canvas')

    const {
      boxLeft,
      boxTop,
      boxWidth,
      boxHeight
    } = this.state

    const sx = Math.ceil(boxLeft * imageStageRatio)
    const sy = Math.ceil(boxTop * imageStageRatio)

    const sWidth = Math.ceil(boxWidth * imageStageRatio)
    const sHeight = Math.ceil(boxHeight * imageStageRatio)
    const dx = 0
    const dy = 0


    const dWidth = Math.ceil(sWidth * pixelRatio)
    const dHeight = Math.ceil(sHeight * pixelRatio)


    canvasContext.drawImage(imagePath, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    canvasContext.draw(false, function () {
      Taro.canvasToTempFilePath({
        x: dx,
        y: dy,
        width: dWidth,
        height: dHeight,
        destWidth: sWidth,
        destHeight: sHeight,
        canvasId: 'cropper-canvas',
        fileType: outputFileType,
        quality
      }).then(res => {
        context.props.success && context.props.success(res)
      }).catch(err => {
        console.error(err)
      })
    })
  }

  /**
   * @desc 取消剪裁
   */
  private handlerCancel = (): void => {
    this.hide()
    this.props.cancel && this.props.cancel()
  }

  public render (): JSX.Element {
    const {
      imagePath,
      showCropper,
      stageWidth,
      stageHeight,
      stageLeft,
      stageTop,
      boxWidth,
      boxLeft,
      boxTop,
      canvasHeight,
      canvasWidth,
    } = this.state
    const { className } = this.props
    const rootStyle = { zIndex: showCropper ? 99 : -99, opacity: showCropper ? '1' : '0' }
    const rootClass = classNames('mn-cropper', className)
    return (
      <View className={rootClass} style={rootStyle}>
        <Image id='image' className='image' src={imagePath} mode='aspectFit' />
        <View
          className='stage'
          style={{ width: `${stageWidth}px`, height: `${stageHeight}px`, left: `${stageLeft}px`, top: `${stageTop}` }}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          onTouchCancel={this.onTouchCancel}
        >
          <View id='box' className='box' style={{ width: `${boxWidth}px`, height: `${boxWidth}px`, left: `${boxLeft}px`, top: `${boxTop}px` }}>
            <View id='lt' className='lt'/>
            <View id='lb' className='lb'/>
            <View id='rt' className='rt'/>
            <View id='rb' className='rb'/>

            <View className='line-v' style='left:33.3%;'/>
            <View className='line-v' style='left:66.6%;'/>
            <View className='line-h' style='top:33.3%;'/>
            <View className='line-h' style='top:66.6%;'/>
          </View>

        </View>

        <Canvas
          canvasId='cropper-canvas'
          style={{ height: `${canvasHeight}px`, width: `${canvasWidth}px`, position: 'fixed', left: '5000rpx' }}
        >
        </Canvas>

        <View className='bar'>
          <View className='btn btn-cancel ripple' onClick={this.handlerCancel}>取消</View>
          <View className='btn btn-submit ripple' onClick={this.handlerCrop}>确定</View>
        </View>
      </View>
    )
  }
}
