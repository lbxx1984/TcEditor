import React from 'react';
import BaseComponent from './core/BaseComponent';
import './css/CheckBox.less';


export default class CheckBox extends BaseComponent {

    static propTypes = {}

    constructor(args) {
        super(args);
    }

    render() {
        const {checked, onChange, label} = this.props;
        const props = {
            type: 'checkbox',
            checked,
            onChange
        };
        return (
            <span  {...this.getContainerBaseProps(this)}>
                <input {...props}/>
                {label}
            </span>
        );;
    }
}
