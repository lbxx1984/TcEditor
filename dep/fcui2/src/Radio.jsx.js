/**
 * 单选框
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var cTools = require('./core/componentTools');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} label 单选框旁边显示的文字，点击文字也可以改变选中状态
         * @param {String} value 单选框的值，触发onChange时随事件对象返回，用于区分单选框的身份
         * @param {Boolean} checked 单选框是否被选中，触发onChange时随事件对象返回，用于表明单选框时候被选中
         * @param {String} labelPosition 文本标签显示的位置，'right'为单选框右侧，否则在左侧
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Radio onChange
         * @param {SyntheticEvent} e React事件对象。此事件一般不需要被监听。
         * @param {HtmlElement} e.target 组件实例的根容器
         * @param {Boolean} e.target.checked Radio是否被选中。如果onChange被触发这个值必然是true
         * @param {String} e.target.value Radio的值，用于区别身份，等于this.props.value。
         */
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                ___uitype___: 'radio',
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                label: '',
                value: '',
                labelPosition: 'right',
                // mixin
                valueTemplate: false
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onLayerClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.inputbox;
            if (!e.target.checked) {
                e.target.checked = !e.target.checked;
                this.___dispatchChange___(e);
            }
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('checkbox', this, {
                style: {position: 'relative'}
            });
            var inputProp = {
                key: 'inputbox',
                ref: 'inputbox',
                type: 'radio',
                name: this.props.name,
                value: this.props.value,
                checked: this.___getValue___(),
                onChange: cTools.noop,
                disabled: this.props.disabled
            };
            var actionLayerProp = {
                key: 'action-layer',
                style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                },
                onClick: this.onLayerClick
            };
            var doms = [];
            doms.push(<input {...inputProp}/>);
            doms[this.props.labelPosition === 'right' ? 'push' : 'unshift'](
                <span className="fcui2-checkbox-label" key="label">{this.props.label}</span>
            );
            doms.push(<div {...actionLayerProp}></div>);
            return (<div {...containerProp}>{doms}</div>);
        }
    });
});
