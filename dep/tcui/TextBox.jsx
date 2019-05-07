import React from 'react';
import BaseComponent from './core/BaseComponent';
import './css/TextBox.less';

export default class TextBox extends BaseComponent {

    static propTypes = {}

    constructor(args) {
        super(args);
        this.name = 'TextBox';
    }

    render() {
        const props = {
            ...this.props,
            ...this.getContainerBaseProps(this),
            type: ['text', 'password'].indexOf(this.props.type) > -1 ? this.props.type : 'text'
        };
        return <input {...props}/>;
    }
}
