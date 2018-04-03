/**
 * @file 修改颜色弹窗内容
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ColorPicker from 'fcui2/ColorPicker.jsx';
import Button from 'fcui2/Button.jsx';


function getValue(value) {
    value = value.toString(16);
    while(value.length < 6) value = '0' + value;
    return JSON.stringify({css: '#' + value});
}


export default class ColorSetter extends Component {

    static propTypes = {
        value: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
        close: PropTypes.func.isRequired
    }

    constructor(args) {
        super(args);
        this.onColorPickerChange = this.onColorPickerChange.bind(this);
        this.onEnterClick = this.onEnterClick.bind(this);
        this.state = {
            value: getValue(this.props.value)
        };
    }

    onColorPickerChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    onEnterClick() {
        const value = JSON.parse(this.state.value);
        this.props.onChange(parseInt(value.css.replace('#', ''), 16));
        this.props.close();
    }

    render() {
        const enterBtnProps = {
            skin: 'black',
            width: 70,
            style: {marginLeft: 10},
            label: 'OK',
            onClick: this.onEnterClick
        };
        const cancelBtnProps = {
            skin: 'black2',
            width: 70,
            style: {marginLeft: 10},
            label: 'Cancel',
            onClick: this.props.close
        };
        const colorPickerProps = {
            value: this.state.value,
            onChange: this.onColorPickerChange
        };
        return (
            <div style={{width: 340, height: 260}} className="in-layer">
                <ColorPicker {...colorPickerProps}/>
                <Button {...enterBtnProps}/>
                <Button {...cancelBtnProps}/>
            </div>
        );
    }
}
