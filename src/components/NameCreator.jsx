/**
 * @file 名称输入弹窗，让用户输入一个不存在名称
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'tcui/Button';
import TextBox from 'tcui/TextBox';
import setCursorPosition from '../tools/util/setCursorPosition';


export default class NameCreator extends Component {

    static propTypes = {
        initialName: PropTypes.string.isRequired,
        onEnter: PropTypes.func.isRequired,
        close: PropTypes.func.isRequired,
        group: PropTypes.array.isRequired
    }

    constructor(args) {
        super(args);
        this.onEnterClick = this.onEnterClick.bind(this);
        this.onTextBoxChange = this.onTextBoxChange.bind(this);
        this.state = {
            value: this.props.initialName,
            isVaild: true
        }
    }

    componentDidMount() {
        setCursorPosition(this.refs.textbox.refs.rootContainer, this.state.value.length)
    }

    onEnterClick() {
        this.props.onEnter(this.state.value.trim());
        this.props.close();
    }

    onTextBoxChange(e) {
        const value = e.target.value;
        let isVaild = true;
        this.props.group.map(function (item) {
            const label = item.label || item.name;
            if (label === value.trim()) {
                isVaild = false;
            }
        });
        this.setState({value, isVaild});
    }

    render() {
        const enterBtnProps = {
            width: 70,
            disabled: !this.state.value || !this.state.isVaild || this.state.value === this.props.initialName,
            label: 'OK',
            onClick: this.onEnterClick
        };
        const cancelBtnProps = {
            style: {width: 70, marginLeft: 10},
            label: 'Cancel',
            onClick: this.props.close
        };
        const textBoxProps = {
            ref: 'textbox',
            value: this.state.value,
            onChange: this.onTextBoxChange
        };
        return (
            <div style={{width: 340, padding: 10}}>
                <div style={{marginBottom: 10}}>
                    Name: <TextBox {...textBoxProps}/>
                </div>
                {!this.state.isVaild ? <div style={{lineHeight: '28px', height: 30, color: 'red', paddingLeft: 10}}>
                    The name already exists.
                </div> : null}
                <Button {...enterBtnProps}/>
                <Button {...cancelBtnProps}/>
            </div>
        );
    }
}
