import React from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './BaseComponent';
import '../css/Background.less';


export default class PortalComponent extends BaseComponent {

    constructor(args) {
        super(args);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.render = this.render.bind(this);
        this.mouseEnterHandler = this.mouseEnterHandler.bind(this);
        this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this);
        this.windowResizeHandler = this.windowResizeHandler.bind(this);
        this.dom = null;
    }

    componentDidMount() {
        this.bg = document.createElement('div');
        this.dom = document.createElement('div');
        this.dom.addEventListener('mouseenter', this.mouseEnterHandler);
        this.dom.addEventListener('mouseleave', this.mouseLeaveHandler);
        window.addEventListener('resize', this.windowResizeHandler);
    }

    componentWillUnmount() {
        if (this.dom.parentNode) {
            this.dom.parentNode.removeChild(this.dom);
        }
        if (this.bg.parentNode) {
            this.bg.parentNode.removeChild(this.bg);
        }
        if (this.dom) {
            this.dom.removeEventListener('mouseenter', this.mouseEnterHandler);
            this.dom.removeEventListener('mouseleave', this.mouseLeaveHandler);
        }
        window.removeEventListener('resize', this.windowResizeHandler);
        this.dom = null;
        this.bg = null;
    }

    componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open) {
            this.props.open ? this.show() : this.hide();
        }
    }

    show() {
        this.bg.className = 'tcui-background';
        this.dom.className = this.getContainerBaseProps().className;
        this.props.hideMask ? null : document.body.appendChild(this.bg);
        document.body.appendChild(this.dom);
        this.setState({}, () => {
            typeof this.onShow === 'function' && this.onShow(this.dom);
        });
    }

    hide() {
        this.bg.parentNode && this.bg.parentNode.removeChild(this.bg);
        this.dom.parentNode && this.dom.parentNode.removeChild(this.dom);
        typeof this.onHide === 'function' && this.onHide(this.dom);
    }

    mouseEnterHandler(evt) {
        typeof this.props.mouseEnterHandler === 'function' && this.props.mouseEnterHandler(evt);
    }

    mouseLeaveHandler(evt) {
        typeof this.props.mouseLeaveHandler === 'function' && this.props.mouseLeaveHandler(evt);
    }

    windowResizeHandler(evt) {
        typeof this.onWindowResize === 'function' && this.onWindowResize(evt);
    }

    render() {
        if (!this.props.open || !this.dom) return null;
        return ReactDOM.createPortal(this.props.children, this.dom);
    }
}
