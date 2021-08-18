import classNames from 'classnames'
import React from 'react'
import { View } from '@tarojs/components'
import { MnActionSheetHeaderProps } from '../../../../types/action-sheet'

export default class MnActionSheetHeader extends React.Component<
  MnActionSheetHeaderProps
> {
  public render (): JSX.Element {
    const rootClass = classNames(
      'mn-action-sheet__header',
      this.props.className
    )

    return <View className={rootClass}>{this.props.children}</View>
  }
}
