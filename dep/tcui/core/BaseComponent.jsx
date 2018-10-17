import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class BaseComponent extends Component {

    static propTypes = {
        disabled: PropTypes.bool,
        reject: PropTypes.bool,
        skin: PropTypes.string,
        size: PropTypes.string
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
        const cName = this.constructor.name.toLowerCase();
        const skin = this.props.skin || this.context.skin || 'normal';
        const size = this.props.size || this.context.size || 'normal';
        const disabled = this.props.disabled;
        const reject = this.props.reject || this.state.reject;
        return {
            ref: 'rootContainer',
            className: [
                `tcui-${cName}`,
                `tcui-${cName}-size-${size}`,
                `tcui-${cName}-skin-${skin}`,
                disabled ? `tcui-${cName}-disabled` : null,
                reject ? `tcui-${cName}-reject`: null
            ].filter(i => !!i).join(' ')
        };
    }
}
