import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { MnActionSheetItemProps } from '../../../../../types/action-sheet'

export default class AtActionSheetItem extends React.Component<
  MnActionSheetItemProps
> {
  public static defaultProps: MnActionSheetItemProps
  public static propTypes: InferProps<MnActionSheetItemProps>

  private handleClick = (args: any): void => {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(args)
    }
  }

  public render (): JSX.Element {
    const rootClass = classNames('mn-action-sheet__item', this.props.className)

    return (
      <View className={rootClass} onClick={this.handleClick}>
        {this.props.children}
      </View>
    )
  }
}

AtActionSheetItem.propTypes = {
  onClick: PropTypes.func
}
