import classNames from 'classnames';
import React from 'react';
import { View } from '@tarojs/components';
export default class MnActionSheetBody extends React.Component {
    render() {
        const rootClass = classNames('mn-action-sheet__body', this.props.className);
        return React.createElement(View, { className: rootClass }, this.props.children);
    }
}
//# sourceMappingURL=index.js.map