import React from 'react';
import ReactDOM from 'react-dom';
import PortalComponent from './core/PortalComponent';
import './css/TitleWindow.less';


export default class TitleWindow extends PortalComponent {

    constructor(args) {
        super(args);
        this.resizingTimeout = null;
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.open) {
            this.show();
            this.setState({});
        }
    }

    onShow() {
        setTimeout(() => {
            const {offsetWidth: width, offsetHeight: height} = this.dom;
            const {clientWidth: pWidth, clientHeight: pHeight} = document.documentElement;
            const left = Math.max(0, (pWidth - width) * 0.5);
            const top = Math.max(0, (pHeight - height) * 0.3);
            this.dom.style.left = left + 'px';
            this.dom.style.top = top + 'px';
            const title = this.dom.getElementsByClassName('tcui-titlewindow-title')[0];
            const content = this.dom.getElementsByClassName('tcui-titlewindow-content')[0];
            const foot = this.dom.getElementsByClassName('tcui-titlewindow-foot')[0];
            const contentMaxHeight = pHeight - (title ? title.offsetHeight : 0) - (foot ? foot.offsetHeight : 0);
            content.style.maxHeight = contentMaxHeight + 'px';
            content.style.overflowY = 'auto';
        }, 300);
    }

    onWindowResize() {
        clearTimeout(this.resizingTimeout);
        this.resizingTimeout = setTimeout(() => this.onShow(), 0);
    }

    render() {
        const {open, title, foot, children, dontUseDefaultTitleBar} = this.props;
        if (!open || !this.dom) return null;
        const pre = 'tcui-titlewindow';
        const close = () => {
            typeof this.props.onClose === 'function' && this.props.onClose();
        };
        const hasCustomTitle = title && (title instanceof Array ? title.length : true);
        const hasCustomFoot = foot && (foot instanceof Array ? foot.length : true);
        const defaultTitleBar = <div className={`${pre}-title`} key="title">
            <div className="close" key="close" onClick={close}>×</div>
            <div className="title" key="title">Default Title</div>
        </div>;
        const customTitleBar = <div className={`${pre}-title`} key="title">
            {typeof title === 'string' ? <div className="close" key="close" onClick={close}>×</div> : null}
            {typeof title === 'string' ? <div className="title" key="title">{title}</div> : title}
        </div>;
        return ReactDOM.createPortal([
            hasCustomTitle ? customTitleBar : (dontUseDefaultTitleBar ? null : defaultTitleBar),
            <div key="content" className={`${pre}-content`}>{children}</div>,
            hasCustomFoot ? <div key="foot" className={`${pre}-foot`}>{foot}</div> : null
        ], this.dom);
    }
}
