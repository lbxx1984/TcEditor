/**
 * @file 名称输入弹窗，让用户输入一个不存在名称
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {



    var React = require('react');
    var Button = require('fcui2/Button.jsx');
    var TextBox = require('fcui2/TextBox.jsx');
    var _ = require('underscore');



    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {
                value: this.props.initialName,
                isVaild: true
            };
        },
        onEnterClick: function (e) {
            this.props.onEnter(this.state.value.trim());
            this.props.close();
        },
        onTextBoxChange: function (e) {
            var value = e.target.value;
            var isVaild = true;
            this.props.group.map(function (item) {
                var label = item.label || item.name;
                if (label === value.trim()) {
                    isVaild = false;
                }
            });
            this.setState({
                value: value,
                isVaild: isVaild
            });
        },
        render: function () {
            var enterBtnProps = {
                skin: 'black',
                width: 70,
                disabled: !this.state.value || !this.state.isVaild || this.state.value === this.props.initialName,
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
            var textBoxProps = {
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
    });

});
