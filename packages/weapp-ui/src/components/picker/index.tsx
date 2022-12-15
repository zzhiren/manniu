import React from 'react'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import {View, Canvas, Image, ITouchEvent} from '@tarojs/components'
import { MnPickerProps, MnPickerStates, TouchImageRelative } from '../../../types/picker'

export default class MnPicker extends React.Component<MnPickerProps, MnPickerStates> {
  public static defaultProps: MnPickerProps
  public static propTypes: InferProps<MnPickerProps>

  public constructor(props: MnPickerProps) {
    super(props);
    this.state = {

    }
  }

  public render (): JSX.Element {
    const {
      className
    } = this.props
    const rootClass = classNames('mn-image-cropper', className)


    return (
      <View className={rootClass}>

      </View>
    )
  }
}

MnPicker.defaultProps = {
  className: ''
}

MnPicker.propTypes = {
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
}
