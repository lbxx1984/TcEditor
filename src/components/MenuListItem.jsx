/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
/* eslint-disable react/no-string-refs */
import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class MenuListItem extends Component {

    static propTypes = {
        disabled: PropTypes.bool,
        checked: PropTypes.bool,
        hotKey: PropTypes.string,
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    }

    static defaultProps = {
        disabled: false,
        checked: false,
        hotKey: ''
    }

    constructor(args) {
        super(args);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        if (this.props.disabled) return;
        e.target = this.refs.container;
        e.target.value = this.props.value
        this.props.onClick(e);
    }

    render() {
        const containerProp = {
            ref: 'container',
            className: 'list-normal-item' + (this.props.disabled ? ' list-normal-item-disabled' : ''),
            onClick: this.onClick
        };
        const checked = this.props.checked ? '●' : '';
        const spanProps = {
            style: {
                display: 'inline-block',
                width: 5
            }
        };
        return (
            <div {...containerProp}>
                {this.props.hasOwnProperty('checked') ? <span {...spanProps}>{checked}</span> : null}
                <span>{this.props.label}</span>
                {this.props.hotKey ? <span className="tc-menu-hotkey">{this.props.hotKey}</span> : null}
            </div>
        );
    }
}
