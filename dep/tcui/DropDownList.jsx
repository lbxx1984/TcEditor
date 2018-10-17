import React from 'react';
import PropTypes from 'prop-types';
import AnchorComponent from './core/AnchorComponent';
import Layer from './Layer';
import './css/DropDownList.less';


export default class DropDownList extends AnchorComponent {

    static propTypes = {
        label: PropTypes.string
    }

    constructor(args) {
        super(args);
    }

    render() {
        const containerProps = {
            ...this.getContainerBaseProps(this),
            onClick: this.openLayer,
            onMouseEnter: this.openLayer,
            onMouseLeave: this.closeLayer
        };
        const layerProps = {
            open: this.state.layerAnchor,
            onMouseEnter: this.openLayer,
            onMouseLeave: this.closeLayer
        };
        return (
            <div {...containerProps}>
                {this.props.label}
                <Layer {...layerProps}>
                    hahahsdasd
                    <span>abs</span>
                    <h1>asdas</h1><h1>asdas</h1><h1>asdas</h1><h1>asdas</h1><h1>asdas</h1><h1>asdas</h1>
                </Layer>
            </div>
        );
    }
}
