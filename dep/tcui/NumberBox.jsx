import React from 'react';
import BaseComponent from './core/BaseComponent';
import './css/NumberBox.less';

export default class NumberBox extends BaseComponent {

    static propTypes = {}

    constructor(args) {
        super(args);
    }

    render() {
        const {value, fixed, type} = this.props;
        let currentValue = value;
        if (String(value).length && !isNaN(value)) {
            if (type === 'int') {
                currentValue = parseInt(Number(value));
            }
            else {
                currentValue = fixed ? +Number(value).toFixed(fixed) : value;
            }
        }
        const props = {
            ...this.props,
            ...this.getContainerBaseProps(this),
            value: currentValue,
            type: 'number'
        };
        return <input {...props}/>;
    }
}
