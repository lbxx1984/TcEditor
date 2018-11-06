import React from 'react';
import BaseComponent from './core/BaseComponent';
import './css/Button.less';


export default class Button extends BaseComponent {

    static propTypes = {}

    constructor(args) {
        super(args);
    }

    render() {
        const {type, label} = this.props;
        const props = {
            ...this.props,
            ...this.getContainerBaseProps(this),
            type: ['button', 'reset', 'submit'].indexOf(type) > -1 ? type : 'button'
        };
        return <button {...props}>
            {label ? label : 'Button'}
        </button>;
    }
}
