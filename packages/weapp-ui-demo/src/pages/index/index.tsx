import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

const list = [
  {
    url: '/pages/basic/icon/index',
    name: 'Icon'
  },
  {
    url: '/pages/basic/cropper/index',
    name: 'Cropper'
  },
  {
    url: '/pages/form/file-picker/index',
    name: 'FilePicker'
  },
  {
    url: '/pages/basic/image-cropper/index',
    name: 'ImageCropper'
  }
]

export default class Index extends React.Component {
  private static routerTo (url: string) {
    Taro.navigateTo({
      url
    })
  }

  public render (): JSX.Element {
    return (
      <View className='index'>
        {
          list.map(v => (
            <View onClick={() => Index.routerTo(v.url)} key={v.url}>{v.name}</View>
          ))
        }
      </View>
    )
  }
}
