/**
 * @file 名称输入弹窗，让用户输入一个不存在名称
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'fcui2/Button.jsx';
import TextBox from 'fcui2/TextBox.jsx';


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
        this.setState({
            value: value,
            isVaild: isVaild
        });
    }

    render() {
        const enterBtnProps = {
            skin: 'black',
            width: 70,
            disabled: !this.state.value || !this.state.isVaild || this.state.value === this.props.initialName,
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
        const textBoxProps = {
            skin: 'black',
            value: this.state.value,
            onChange: this.onTextBoxChange
        };
        return (
            <div style={{width: 340, height: 100}}>
                <div style={{margin: 10}}>
                    Name: <TextBox {...textBoxProps}/>
                </div>
                <div style={{lineHeight: '28px', height: 30, color: 'red', paddingLeft: 10}}>
                    {!this.state.isVaild ? 'The name already exists.' : ''}
                </div>
                <Button {...enterBtnProps}/>
                <Button {...cancelBtnProps}/>
            </div>
        );
    }
}
