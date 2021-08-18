import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { MnActionSheetFooterProps } from '../../../../types/action-sheet'

export default class MnActionSheetFooter extends React.Component<
  MnActionSheetFooterProps
> {
  public static defaultProps: MnActionSheetFooterProps
  public static propTypes: InferProps<MnActionSheetFooterProps>

  private handleClick = (...args: any[]): void => {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(...args)
    }
  }

  public render (): JSX.Element {
    const rootClass = classNames(
      'mn-action-sheet__footer',
      this.props.className
    )

    return (
      <View onClick={this.handleClick} className={rootClass}>
        {this.props.children}
      </View>
    )
  }
}

MnActionSheetFooter.propTypes = {
  onClick: PropTypes.func
}
