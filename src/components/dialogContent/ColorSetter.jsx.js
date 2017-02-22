/**
 * @file 修改颜色弹窗内容
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {



    var React = require('react');
    var ColorPicker = require('fcui2/ColorPicker.jsx');
    var Button = require('fcui2/Button.jsx');
    var _ = require('underscore');
    var colorTools = require('fcui2/core/colorPickerTools');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            var value = this.props.value.toString(16);
            while(value.length < 6) value = '0' + value;
            return {
                value: JSON.stringify({css: '#' + value})
            };
        },
        onColorPickerChange: function (e) {
            this.setState({
                value: e.target.value
            });
        },
        onEnterClick: function (e) {
            var value = JSON.parse(this.state.value);
            this.props.onChange(parseInt(value.css.replace('#', ''), 16));
            this.props.close();
        },
        render: function () {
            var enterBtnProps = {
                skin: 'black',
                width: 70,
                style: {marginLeft: 10},
                label: 'OK',
                onClick: this.onEnterClick
            };
            var cancelBtnProps = {
                skin: 'black2',
                width: 70,
                style: {marginLeft: 10},
                label: 'Cancel',
                onClick: this.props.close
            };
            var colorPickerProps = {
                value: this.state.value,
                onChange: this.onColorPickerChange
            };
            return (
                <div style={{width: 340, height: 260}}>
                    <ColorPicker {...colorPickerProps}/>
                    <Button {...enterBtnProps}/>
                    <Button {...cancelBtnProps}/>
                </div>
            );
        }
    });

});
