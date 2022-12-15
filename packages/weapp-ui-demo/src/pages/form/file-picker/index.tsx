import React from 'react'
import { View } from '@tarojs/components'
import { MnFilePicker } from '@manniu/weapp-ui'
import './index.scss'

const action = 'https://manniu-zbboss-test.oss-cn-shanghai.aliyuncs.com/'

export default class FilePicker extends React.Component<{},
  {
    files: Array<{url: string}>
  }
  > {
  public constructor (props) {
    super(props)
    this.state = {
      files: [
        {
          url: '20210729/a9v2dbVMybioa1cf3c934a8210d4dfb2cef8fbb90f2e.jpg'
        },
        {
          url: '20210729/a9v2dbVMybioa1cf3c934a8210d4dfb2cef8fbb90f2e.gif'
        },
        {
          url: '20210813/V14DyQP11Vlbef6cf8bb31744d1f4709926f2ee1b70a.xlsx'
        },
        {
          url: '20210813/V14DyQP11Vlbef6cf8bb31744d1f4709926f2ee1b70a.doc'
        },
        {
          url: '20210813/V14DyQP11Vlbef6cf8bb31744d1f4709926f2ee1b70a.docx'
        },
        {
          url: '20210813/V14DyQP11Vlbef6cf8bb31744d1f4709926f2ee1b70a.pdf'
        },
        {
          url: '20210813/V14DyQP11Vlbef6cf8bb31744d1f4709926f2ee1b70a.ppt'
        },
        {
          url: '20210813/V14DyQP11Vlbef6cf8bb31744d1f4709926f2ee1b70a.pptx'
        },
        {
          url: '20210813/V14DyQP11Vlbef6cf8bb31744d1f4709926f2ee1b70a.exe'
        },
        {
          url: '20210813/V14DyQP11Vlbef6cf8bb31744d1f4709926f2ee1b70a.mp4'
        },
        {
          url: '20210813/V14DyQP11Vlbef6cf8bb31744d1f4709926f2ee1b70a.mp3'
        }
      ]
    }
  }

  private onAdd (files: []) {
    console.log('files', files)
  }

  private onRemove (idx: number) {
    console.log(this)
    const { files } = this.state
    files.splice(idx, 1)
    this.setState({
      files: files
    })
  }

  public render (): JSX.Element {
    const { files } = this.state
    return (
      <View className='index'>
        <MnFilePicker
          action={action}
          files={files}
          onAdd={this.onAdd.bind(this)}
          onRemove={this.onRemove.bind(this)}
          showAdd
          showRemove
        />
      </View>
    )
  }
}
