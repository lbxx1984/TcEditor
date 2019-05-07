import React from 'react';
import BaseComponent from './core/BaseComponent';
import NumberBox from './NumberBox';
import css2rgb from './util/CSS2RGB';
import rgb2hsl from './util/RGB2HSL';
import hsl2rgb from './util/HSL2RGB';
import rgb2css from './util/RGB2CSS';
import './css/ColorPicker.less';


const DEFAULT_RGB_PROPS = {
    min: 0,
    max: 255,
    type: 'int',
    step: 1,
    width: 80
};

const DEFAULT_HSL_PROPS = {
    min: 0,
    max: 1,
    type: 'float',
    step: 0.01,
    fixed: 2,
    width: 80
};


function getValueObject(value) {
    if (value == null) {
        value = {};
    }
    try {
        value = JSON.parse(value);
    }
    catch (e) {
        value = {
            css: '#000000',
            rgb: [0, 0, 0],
            hsl: [0, 0, 0]
        };
    }
    value.css = typeof value.css !== 'string' ? '#000000' : value.css;
    value.rgb = css2rgb(value.css);
    value.hsl = rgb2hsl(value.rgb[0], value.rgb[1], value.rgb[2]);
    return value;
}


export default class ColorPicker extends BaseComponent {

    static propTypes = {}

    constructor(args) {
        super(args);
        this.name = 'ColorPicker';
        this.state = {
            cursorLeft: null,
            cursorRight: null
        };
        this.onCanvasClick = this.onCanvasClick.bind(this);
    }

    componentDidMount() {
        this.renderColors();
    }

    componentDidUpdate() {
        this.renderColors();
    }

    renderColors() {
        const value = getValueObject(this.props.value);
        const {canvasLeft, canvasRight} = this.refs;
        // 渲染大色块颜色
        const ctxLeft = canvasLeft.getContext('2d');
        const lineGradientLeft = ctxLeft.createLinearGradient(canvasLeft.width, canvasLeft.height, 0, 0);  
        lineGradientLeft.addColorStop(0, 'rgba(0, 0, 0, 1)');
        lineGradientLeft.addColorStop(0.5, 'rgba(' + value.rgb.join(', ') + ', 1)');
        lineGradientLeft.addColorStop(1, 'rgba(255, 255, 255, 1)');   
        ctxLeft.fillStyle = lineGradientLeft;    
        ctxLeft.fillRect(0, 0, canvasLeft.width, canvasLeft.height);
        // 渲染右侧颜色选择区
        const ctxRight = canvasRight.getContext('2d');
        const lineGradientRight = ctxRight.createLinearGradient(1, 0, 1, canvasRight.height);
        for (let n = 0; n < 256; n++) {
            let rgb = hsl2rgb(n / 255, 1, 0.5);
            lineGradientRight.addColorStop(n / 255, rgb2css(rgb[0], rgb[1], rgb[2]));
        }
        ctxRight.fillStyle = lineGradientRight;
        ctxRight.fillRect(0, 0, canvasRight.width, canvasRight.height); 
        ctxRight.stroke();
        // 渲染虚拟鼠标位置
        if (this.state.cursorLeft) {
            return;
        }
        const imgDataLeft = ctxLeft.getImageData(0, 0, canvasLeft.width, canvasLeft.height);
        const posLeft = {left: 0, top: 0};
        for (let i = 0; i < imgDataLeft.data.length; i += 4) {
            if (
                Math.abs(imgDataLeft.data[i] - value.rgb[0]) <= 2
                && Math.abs(imgDataLeft.data[i + 1] - value.rgb[1]) <= 2
                && Math.abs(imgDataLeft.data[i + 2] - value.rgb[2]) <= 2
            ) {
                const p = i / 4;
                posLeft.top = p % canvasLeft.width - 3;
                posLeft.left = (p - posLeft.top) / canvasLeft.width - 3;
                break;
            }
        }
        // 获取右侧渲染去value的位置
        const imgDataRight = ctxRight.getImageData(0, 0, canvasRight.width, canvasRight.height);
        const posRight = {left: 5, top: -100};
        for (let i = 0; i < imgDataRight.data.length; i += 4) {
            if (
                Math.abs(imgDataRight.data[i] - value.rgb[0]) <= 2
                && Math.abs(imgDataRight.data[i + 1] - value.rgb[1]) <= 2
                && Math.abs(imgDataRight.data[i + 2] - value.rgb[2]) <= 2
            ) {
                const p = i / 4;
                posRight.top = parseInt(p / canvasRight.width, 10) - 3;
                posRight.left = 2;
                break;
            }
        }
        this.setState({
            cursorLeft: posLeft,
            cursorRight: posRight
        });
    }

    onCanvasClick(e) {
        const {offsetX: x, offsetY: y} = e.nativeEvent;
        const value = getValueObject(this.props.value);
        const rgb = e.target.getContext('2d').getImageData(x, y, 1, 1).data;
        value.rgb = [rgb[0], rgb[1], rgb[2]];
        value.css = rgb2css(rgb[0], rgb[1], rgb[2]);
        value.hsl = rgb2hsl(rgb[0], rgb[1], rgb[2]);
        const stateDiff = {};
        stateDiff[e.target.className.indexOf('canvas-right') > -1 ? 'cursorRight' : 'cursorLeft'] = {
            left: e.target.className.indexOf('canvas-right') > -1 ? 2 : x - 3,
            top: y - 3
        };
        if (e.target.className.indexOf('canvas-right') > -1) {
            stateDiff.canvasLeftMainColor = value.rgb;
        }
        this.setState(stateDiff);
        e = {target: this.refs.container};
        e.target.value = JSON.stringify(value);
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e);
        }
    }

    numberBoxChangeHandlerFactory(field, index) {
        return e => {
            const value = getValueObject(this.props.value);
            let newValue = e.target.value;
            if (field === 'rgb' || (field !== 'rgb' && newValue.charAt(newValue.length - 1) !== '.')) {
                newValue = +newValue;
            }
            value[field][index] = newValue;
            if (typeof newValue !== 'string') {
                if (field === 'rgb') {
                    value.css = rgb2css(value.rgb[0], value.rgb[1], value.rgb[2]);
                    value.hsl = rgb2hsl(value.rgb[0], value.rgb[1], value.rgb[2]);
                }
                else {
                    value.rgb = hsl2rgb(value.hsl[0], value.hsl[1], value.hsl[2]);
                    value.css = rgb2css(value.rgb[0], value.rgb[1], value.rgb[2]);
                }
            }
            e = {target: this.refs.container};
            e.target.value = JSON.stringify(value);
            if (typeof this.props.onChange === 'function') {
                this.props.onChange(e);
            }
        };
    }

    render() {
        const value = getValueObject(this.props.value);
        const canvasLeftProps = {
            ref: 'canvasLeft',
            width: 200,
            height: 200,
            className: 'canvas-left',
            onClick: this.onCanvasClick
        };
        const canvasRightProps = {
            ref: 'canvasRight',
            width: 11,
            height: 200,
            className: 'canvas-right',
            onClick: this.onCanvasClick
        };
        const rProps = Object.assign({}, DEFAULT_RGB_PROPS, {
            value: value.rgb[0],
            onChange: this.numberBoxChangeHandlerFactory('rgb', 0)
        });
        const gProps = Object.assign({}, DEFAULT_RGB_PROPS, {
            value: value.rgb[1],
            onChange: this.numberBoxChangeHandlerFactory('rgb', 1)
        });
        const bProps = Object.assign({}, DEFAULT_RGB_PROPS, {
            value: value.rgb[2],
            onChange: this.numberBoxChangeHandlerFactory('rgb', 2)
        });
        const hProps = Object.assign({}, DEFAULT_HSL_PROPS, {
            value: value.hsl[0],
            onChange: this.numberBoxChangeHandlerFactory('hsl', 0)
        });
        const sProps = Object.assign({}, DEFAULT_HSL_PROPS, {
            value: value.hsl[1],
            onChange: this.numberBoxChangeHandlerFactory('hsl', 1)
        });
        const lProps = Object.assign({}, DEFAULT_HSL_PROPS, {
            value: value.hsl[2],
            onChange: this.numberBoxChangeHandlerFactory('hsl', 2)
        });
        const {cursorLeft, cursorRight} = this.state;
        const cursor1Style = {
            left: cursorLeft ? cursorLeft.left + 10 : -100,
            top: cursorLeft ? cursorLeft.top + 10 : -100,
            borderColor: rgb2css(255 - value.rgb[0], 255 - value.rgb[1], 255 - value.rgb[2])
        };
        const cursor2Style = {
            left: cursorRight ? cursorRight.left + 216 : -100,
            top: cursorRight ? cursorRight.top + 10 : -100,
            borderColor: rgb2css(255 - value.rgb[0], 255 - value.rgb[1], 255 - value.rgb[2])
        };
        return (
            <div {...this.getContainerBaseProps(this)} ref="container">
                <canvas {...canvasLeftProps}></canvas>
                <canvas {...canvasRightProps}></canvas>
                <div className="input-container">
                    <div><span>R</span><NumberBox {...rProps}/></div>
                    <div><span>G</span><NumberBox {...gProps}/></div>
                    <div><span>B</span><NumberBox {...bProps}/></div>
                    <hr/>
                    <div><span>H</span><NumberBox {...hProps}/></div>
                    <div><span>S</span><NumberBox {...sProps}/></div>
                    <div><span>L</span><NumberBox {...lProps}/></div>
                </div>
                <div style={cursor2Style} className="virtual-cursor"></div>
                <div style={cursor1Style} className="virtual-cursor"></div>
            </div>
        );
    }
}
