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
     * Converts an HSL color value to RGB.
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation 0 - 255
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
     * Converts an RGB color value to HSL. Conversion formula
     *
     * @param   Number  r       The red color value 0 - 255
     * @param   Number  g       The green color value 0 - 255
     * @param   Number  b       The blue color value 0 - 255
     * @return  Array           The HSL representation
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
        getInitialState: function () {
            return {
                color: '#F00',
                width: 200,
                height: 15
            };
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
            this.renderColor(this.state.color);
        },
        render: function () {
            var me = this;
            var prop = {
                width: this.state.width,
                height: this.state.height,
                onClick: clickHandler
            };
            this.state.color = this.props.value;
            function clickHandler(e) {
                var x = e.nativeEvent.offsetX;
                var y = e.nativeEvent.offsetY;
                var rgb = e.target.getContext('2d').getImageData(x, y, 1, 1).data;
                var color = RGB2CSS(rgb[0], rgb[1], rgb[2]);
                me.setState({color: color});
                if (e.target.dataset.cmd === 'canvas1') {
                    me.renderColor(color);
                }
            }
            return (
                <div className="color-picker">
                    <div className="color-label" style={{backgroundColor: this.state.color}}></div>
                    <div className="color-select">
                        <canvas ref="canvas2" data-cmd="canvas2" {...prop}></canvas>
                        <canvas ref="canvas1" data-cmd="canvas1" {...prop}></canvas>
                    </div>
                </div>
            );
        }
    });
});
