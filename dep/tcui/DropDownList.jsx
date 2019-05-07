import React from 'react';
import PropTypes from 'prop-types';
import AnchorComponent from './core/AnchorComponent';
import Layer from './Layer';
import './css/DropDownList.less';


function itemFactory(me, item, key) {
    const Render = me.props.itemRenderer;
    const renderProps = {
        ...item,
        me,
        key,
        onClick: me.props.onClick
    };
    const itemProps = {
        key,
        className: 'tcui-dropdownlist-item',
        onClick: e => {
            e.target.value = item.value;
            typeof me.props.onClick === 'function' && me.props.onClick(e);
        }
    };
    return Render ? <Render {...renderProps}/> : <div {...itemProps}>{item.label}</div>;
}


export default class DropDownList extends AnchorComponent {

    static propTypes = {
        label: PropTypes.string
    }

    constructor(args) {
        super(args);
        this.name = 'DropDownList';
    }

    render() {
        const containerProps = {
            ...this.getContainerBaseProps(this),
            onClick: this.openLayer,
            onMouseEnter: this.openLayer,
            onMouseLeave: this.closeLayer
        };
        const layerProps = {
            className: 'tcui-dropdownlist-layer',
            skin: this.props.skin,
            open: this.state.layerAnchor,
            onMouseEnter: this.openLayer,
            onMouseLeave: this.closeLayer
        };
        return (
            <div {...containerProps}>
                {this.props.label}
                <Layer {...layerProps}>
                    {this.props.datasource.map((item, index) => itemFactory(this, item, index))}
                </Layer>
            </div>
        );
    }
}
