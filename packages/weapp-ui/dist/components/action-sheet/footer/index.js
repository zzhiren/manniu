import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { View } from '@tarojs/components';
export default class MnActionSheetFooter extends React.Component {
    constructor() {
        super(...arguments);
        this.handleClick = (...args) => {
            if (typeof this.props.onClick === 'function') {
                this.props.onClick(...args);
            }
        };
    }
    render() {
        const rootClass = classNames('mn-action-sheet__footer', this.props.className);
        return (React.createElement(View, { onClick: this.handleClick, className: rootClass }, this.props.children));
    }
}
MnActionSheetFooter.propTypes = {
    onClick: PropTypes.func
};
//# sourceMappingURL=index.js.map