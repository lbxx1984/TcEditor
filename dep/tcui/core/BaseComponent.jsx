import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class BaseComponent extends Component {

    static propTypes = {
        disabled: PropTypes.bool,
        reject: PropTypes.bool,
        skin: PropTypes.string,
        size: PropTypes.string,
        width: PropTypes.string,
        height: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object
    }

    static contextTypes = {
        skin: PropTypes.string,
        size: PropTypes.string
    }

    constructor(args) {
        super(args);
        this.getContainerBaseProps = this.getContainerBaseProps.bind(this);
        this.state = {
            reject: false
        };
    }

    getContainerBaseProps() {
        const cName = String(this.name).toLowerCase();
        const skin = this.props.skin || this.context.skin || 'normal';
        const size = this.props.size || this.context.size || 'normal';
        const disabled = this.props.disabled;
        const reject = this.props.reject || this.state.reject;
        const fastStyle = {};
        if (!isNaN(String(this.props.width).replace('px', ''))) {
            fastStyle.width = String(this.props.width).replace('px', '') +'px';
        }
        if (!isNaN(String(this.props.height).replace('px', ''))) {
            fastStyle.height = String(this.props.height).replace('px', '') +'px';
        }
        const style = {
            ...fastStyle,
            ...this.props.style
        };
        return {
            ref: 'rootContainer',
            style,
            className: [
                `tcui-${cName}`,
                `tcui-${cName}-size-${size}`,
                `tcui-${cName}-skin-${skin}`,
                disabled ? `tcui-${cName}-disabled` : null,
                reject ? `tcui-${cName}-reject`: null,
                this.props.className ? this.props.className : null
            ].filter(i => !!i).join(' ')
        };
    }
}
