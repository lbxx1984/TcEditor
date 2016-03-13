define(function (require) {

    /**
     * RGB颜色转CSS串
     *
     * @param {number} r 红色0 - 255
     * @param {number} g 绿色0 - 255
     * @param {number} b 蓝色0 - 255
     * @return {string} CSS颜色串，#FFFFFF
     */
    function RGB2CSS(r, g, b) {
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);
        r = r.length === 1 ? '0' + r : r;
        g = g.length === 1 ? '0' + g : g;
        b = b.length === 1 ? '0' + b : b;
        return '#' + r + g + b;
    }

    /**
     * CSS串转RGB颜色
     *
     * @param {string} s CSS颜色#000000，必须是6位
     * @return {Array.<number>} RGB颜色数组，0-255
     */
    function CSS2RGB(s) {
        s = s.replace('#', '');
        var r = parseInt(s.slice(0, 2), 16);
        var g = parseInt(s.slice(2, 4), 16);
        var b = parseInt(s.slice(4, 6), 16);
        return [r, g, b];
    }

    /**
     * HSL颜色转RGB颜色
     *
     * @param {number} h 色相
     * @param {number} s 饱和度
     * @param {number} l 亮度
     * @return {Array.<number>} RGB颜色数组，0-255
     */
    function HSL2RGB(h, s, l){
        var r, g, b;
        if(s === 0){
            r = g = b = l;
        }
        else {
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    /**
     * RGB颜色转HSL颜色
     *
     * @param {number} r 红色0 - 255
     * @param {number} g 绿色0 - 255
     * @param {number} b 蓝色0 - 255
     * @return {Array.<number>} HSL颜色数组，0-1
     */
    function RGB2HSL(r, g, b){
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if(max === min){
            h = s = 0;
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h, s, l];
    }

    return React.createClass({
        getDefaultProps : function () {
            return {width: 140, height: 15};
        },
        getInitialState: function () {
            return {
                value: '#FF0000',   // 主颜色，外界可设置
                rgb: [0, 0, 0],     // 从动颜色，外界可读，内部可设置
                hsl: [0, 0, 0]      // 从动颜色，外界可读，内部可设置
            };
        },
        componentDidMount: function () {
            var canvas = this.refs.canvas1.getDOMNode();
            var ctx = canvas.getContext('2d');
            var linear = ctx.createLinearGradient(0, 1, canvas.width, 1);
            for (var n = 0; n < 256; n++) {
                var rgb = HSL2RGB(n / 255, 1, 0.5);
                linear.addColorStop(n / 255, RGB2CSS(rgb[0], rgb[1], rgb[2]));
            }
            ctx.fillStyle = linear;
            ctx.fillRect(0, 0, canvas.width, canvas.height); 
            ctx.stroke();
            this.renderColor(this.state.value);
        },
        renderColor: function (color) {
            var canvas = this.refs.canvas2.getDOMNode();
            var ctx = canvas.getContext('2d');
            var linear = ctx.createLinearGradient(0, 1, canvas.width, 1);
            linear.addColorStop(0.1, '#FFF');
            linear.addColorStop(0.5, color);
            linear.addColorStop(0.9, '#000');
            ctx.fillStyle = linear;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.stroke();
        },
        updateColor: function (type, value, fireChange, renderCanvas, silent) {
            var colors = {};
            if (type === 'css') {
                colors.value = value;
                colors.rgb = CSS2RGB(value);
                colors.hsl = RGB2HSL(colors.rgb[0], colors.rgb[1], colors.rgb[2]);
            }
            else if (type === 'rgb') {
                colors.rgb = value;
                colors.value = RGB2CSS(colors.rgb[0], colors.rgb[1], colors.rgb[2]);
                colors.hsl = RGB2HSL(colors.rgb[0], colors.rgb[1], colors.rgb[2]);
            }
            else if (type === 'hsl') {
                colors.hsl = value;
                colors.rgb = HSL2RGB(colors.hsl[0], colors.hsl[1], colors.hsl[2]);
                colors.value = RGB2CSS(colors.rgb[0], colors.rgb[1], colors.rgb[2]);
            }
            if (!silent) {
                this.setState(colors);
            }
            if (fireChange && typeof this.props.onChange === 'function') {
                this.props.onChange({target: this, value: colors});
            }
            if (renderCanvas) {
                this.renderColor(colors.value);
            }
            return colors;
        },
        clickHandler: function (e) {
            var x = e.nativeEvent.offsetX;
            var y = e.nativeEvent.offsetY;
            var rgb = e.target.getContext('2d').getImageData(x, y, 1, 1).data;
            this.updateColor('rgb', rgb, true, e.target.dataset.cmd === 'canvas1');
        },
        inputChangeHandler: function (e) {
            var type = e.target.dataset.cmd;
            var index = ~~e.target.dataset.index;
            var value = Number(e.target.value);
            value = Math.min(e.target.max, value);
            value = Math.max(e.target.min, value);
            var result = type === 'rgb' ? this.state.rgb : this.state.hsl;
            result[index] = value;
            this.updateColor(type, result, true, true);
        },
        render: function () {
            var me = this;
            var prop = {
                width: this.props.width - 6,
                height: this.props.height,
                onClick: this.clickHandler
            };
            var rgb = CSS2RGB(this.state.value);
            this.state.rgb = rgb;
            this.state.hsl = RGB2HSL(rgb[0], rgb[1], rgb[2]);
            return (
                <div className="color-picker">
                    <div className="color-label" style={{backgroundColor: this.state.value}}></div>
                    <div className="color-select">
                        <div className="color-input-box">
                            {inputBox('RGB', 0, 0, 255, 1)}
                            {inputBox('HSL', 2, 0, 1, 0.01)}
                        </div>
                        <canvas ref="canvas2" data-cmd="canvas2" {...prop}></canvas>
                        <canvas ref="canvas1" data-cmd="canvas1" {...prop}></canvas>
                    </div>
                </div>
            );
            function inputBox(type, fixed, min, max, step) {
                var index = [0, 1, 2];
                type = type.toLowerCase();
                function item(i) {
                    var value = me.state[type][i].toFixed(fixed);
                    var prop = {
                        type: 'number', step: step, min: min, max: max, value: value,
                        'data-cmd': type,
                        'data-index': i,
                        onChange: me.inputChangeHandler
                    };
                    return <input {...prop}/>;
                }
                return (<div className="color-input-content">{type}{index.map(item)}</div>);
            }
        }
    });
});
