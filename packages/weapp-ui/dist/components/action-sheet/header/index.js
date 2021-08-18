import classNames from 'classnames';
import React from 'react';
import { View } from '@tarojs/components';
export default class MnActionSheetHeader extends React.Component {
    render() {
        const rootClass = classNames('mn-action-sheet__header', this.props.className);
        return React.createElement(View, { className: rootClass }, this.props.children);
    }
}
//# sourceMappingURL=index.js.map