import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { CommonEvent } from '@tarojs/components/types/common'
import {
  MnActionSheetProps,
  MnActionSheetState
} from '../../../types/action-sheet'
import MnActionSheetBody from './body/index'
import MnActionSheetFooter from './footer/index'
import MnActionSheetHeader from './header/index'

export default class MnActionSheet extends React.Component<
  MnActionSheetProps,
  MnActionSheetState
> {
  public static defaultProps: MnActionSheetProps
  public static propTypes: InferProps<MnActionSheetProps>

  public constructor (props: MnActionSheetProps) {
    super(props)
    const { isOpened } = props

    this.state = {
      _isOpened: isOpened
    }
  }

  public UNSAFE_componentWillReceiveProps (nextProps: MnActionSheetProps): void {
    const { isOpened } = nextProps
    if (isOpened !== this.state._isOpened) {
      this.setState({
        _isOpened: isOpened
      })

      !isOpened && this.handleClose()
    }
  }

  private handleClose = (): void => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose()
    }
  }

  private handleCancel = (): void => {
    if (typeof this.props.onCancel === 'function') {
      return this.props.onCancel()
    }
    this.close()
  }

  private close = (): void => {
    this.setState(
      {
        _isOpened: false
      },
      this.handleClose
    )
  }

  private handleTouchMove = (e: CommonEvent): void => {
    e.stopPropagation()
    e.preventDefault()
  }

  public render (): JSX.Element {
    const { title, cancelText, className } = this.props
    const { _isOpened } = this.state

    const rootClass = classNames(
      'mn-action-sheet',
      {
        'mn-action-sheet--active': _isOpened
      },
      className
    )

    return (
      <View className={rootClass} onTouchMove={this.handleTouchMove}>
        <View onClick={this.close} className='mn-action-sheet__overlay' />
        <View className='mn-action-sheet__container'>
          {title && <MnActionSheetHeader>{title}</MnActionSheetHeader>}
          <MnActionSheetBody>{this.props.children}</MnActionSheetBody>
          {cancelText && (
            <MnActionSheetFooter onClick={this.handleCancel}>
              {cancelText}
            </MnActionSheetFooter>
          )}
        </View>
      </View>
    )
  }
}

MnActionSheet.defaultProps = {
  title: '',
  cancelText: '',
  isOpened: false
}

MnActionSheet.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  isOpened: PropTypes.bool.isRequired,
  cancelText: PropTypes.string
}
