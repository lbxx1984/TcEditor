/**
 * Dialog Confirm渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var Button = require('../../Button.jsx');
    var React = require('react');


    return React.createClass({
        /**
         * @properties 
         * @param {String} message 主区域显示的内容
         * @param {Function} onEnter 点击确定的回调
         * @param {Function} onCancel 点击取消的回调
         */
        getDefaultProps : function () {
            return {
                message: 'Message',
                onEnter: null,
                onCancel: null
            };
        },
        onEnterClick: function () {
            typeof this.props.onEnter === 'function' && this.props.onEnter();
            this.props.close();
        },
        onCancelClick: function () {
            typeof this.props.onCancel === 'function' && this.props.onCancel();
            this.props.close();
        },
        render: function () {
            return (
                <div className="fcui2-dialog-alert">
                    <div className="message">{this.props.message}</div> 
                    <div className="button-bar">
                        <Button skin="important" label="确定" onClick={this.onEnterClick}/>
                        <Button label="取消" onClick={this.onCancelClick}/>
                    </div>
                </div>
            );
        }
    });


});
