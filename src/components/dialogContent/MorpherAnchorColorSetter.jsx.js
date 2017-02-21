/**
 * @file 变形器， 锚点颜色修改，弹窗内容
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {



    var React = require('react');
    var ColorPicker = require('fcui2/ColorPicker.jsx');
    var Button = require('fcui2/Button.jsx');
    var _ = require('underscore');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {};
        },
        render: function () {
            var enterBtnProps = {
                skin: 'black',
                width: 70,
                style: {marginLeft: 10},
                label: 'OK'
            };
            var cancelBtnProps = {
                skin: 'black2',
                width: 70,
                style: {marginLeft: 10},
                label: 'Cancel',
                onClick: this.props.close
            };
            return (
                <div style={{width: 340, height: 260}}>
                    <ColorPicker/>
                    <Button {...enterBtnProps}/>
                    <Button {...cancelBtnProps}/>
                </div>
            );
        }
    });

});
