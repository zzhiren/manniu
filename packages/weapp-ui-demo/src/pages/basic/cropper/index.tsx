import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { MnCropper } from '@manniu/weapp-ui'
import './index.scss'

interface StateTypes {
  imgUrl: string
}

export default class Cropper extends React.Component<null, StateTypes> {

  public constructor(props) {
    super(props)
    this.state = {
      imgUrl:''
    }
  }

  CropperRef: any = null

  private createRef = (node): void => {
    console.log('createRef')
    this.CropperRef = node
  }

  private onSuccess = (res): void => {
    this.CropperRef.hide()
    const context = this
    context.setState({
      imgUrl: res.tempFilePath
    })
  }

  private initCropper = (imagePath: string): void => {
    console.log('initCropper', this.CropperRef)
    this.CropperRef.show();
    this.CropperRef.init && this.CropperRef.init({
      imagePath: imagePath,       //*必填
      outputFileType: 'jpg',              //可选。目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
      quality: 1,                         //可选。图片的质量。默认值为1，即最高质量。目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
      aspectRatio: null,                  //可选。裁剪的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0
      minBoxWidthRatio: 0.2,              //可选。最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
      minBoxHeightRatio: 0.2,             //可选。同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。
      initialBoxWidthRatio: 0.6,          //可选。剪裁框初始大小比率。默认值0.6，即剪裁框默认宽度为图片宽度的0.6倍。
      initialBoxHeightRatio: 0.6          //可选。同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
    })
  }

  private choose = (): void => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    }).then(res => {
      this.initCropper(res.tempFilePaths[0])
    })
  }

  public render (): JSX.Element {
    const { imgUrl } = this.state
    return (
      <View>
        <View>
          <View className='no-data' onClick={this.choose}>点击上传</View>
          <Image className='image' src={imgUrl} mode='aspectFit' />
        </View>
        <MnCropper ref={this.createRef} success={this.onSuccess} />
      </View>
    )
  }
}
