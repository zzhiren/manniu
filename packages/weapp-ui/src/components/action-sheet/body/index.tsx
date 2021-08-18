import classNames from 'classnames'
import React from 'react'
import { View } from '@tarojs/components'
import { MnActionSheetBodyProps } from '../../../../types/action-sheet'

export default class MnActionSheetBody extends React.Component<
  MnActionSheetBodyProps
> {
  public render (): JSX.Element {
    const rootClass = classNames('mn-action-sheet__body', this.props.className)
    return <View className={rootClass}>{this.props.children}</View>
  }
}
