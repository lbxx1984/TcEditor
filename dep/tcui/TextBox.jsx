import React from 'react';
import BaseComponent from './core/BaseComponent';
import './css/TextBox.less';

export default class TextBox extends BaseComponent {

    static propTypes = {}

    constructor(args) {
        super(args);
    }

    render() {
        const props = {
            ...this.props,
            ...this.getContainerBaseProps(this)
        };
        return <input {...props}/>;
    }
}
