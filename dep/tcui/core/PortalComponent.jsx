import React from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './BaseComponent';


export default class PortalComponent extends BaseComponent {

    constructor(args) {
        super(args);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.render = this.render.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.dom = null;
    }

    componentDidMount() {
        this.dom = document.createElement('div');
        this.dom.addEventListener('mouseenter', this.onMouseEnter);
        this.dom.addEventListener('mouseleave', this.onMouseLeave);
    }

    componentWillUnmount() {
        if (this.dom.parentNode) {
            this.dom.parentNode.removeChild(this.dom);
        }
        this.dom.removeAllListeners('mouseenter');
        this.dom.removeAllListeners('mouseleave');
        this.dom = null;
    }

    componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open) {
            this.props.open ? this.show() : this.hide();
        }
    }

    show() {
        this.dom.className = this.getContainerBaseProps().className;
        document.body.appendChild(this.dom);
        typeof this.onShow === 'function' && this.onShow(this.dom);
    }

    hide() {
        if (this.dom.parentNode) this.dom.parentNode.removeChild(this.dom);
        typeof this.onHide === 'function' && this.onHide(this.dom);
    }

    onMouseEnter(evt) {
        typeof this.props.onMouseEnter === 'function' && this.props.onMouseEnter(evt);
    }

    onMouseLeave(evt) {
        typeof this.props.onMouseLeave === 'function' && this.props.onMouseLeave(evt);
    }

    render() {
        return this.props.open ? ReactDOM.createPortal(this.props.children, this.dom) : null;
    }
}
