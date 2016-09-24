/**
 * 翻页器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var cTools = require('./core/componentTools');
    var factory = require('./factories/pagerFactory.jsx');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {Number} min 翻页器最小页数
         * @param {Number} max 翻页器最大页数
         * @param {Number} threshold 翻页器阈值，显示时，距离value距离超过此值的按钮将被隐藏
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        mixins: [InputWidget],
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                min: 1,
                max: 10,
                threshold: Number.POSITIVE_INFINITY,
                // mixin
                valueTemplate: Number.POSITIVE_INFINITY
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onButtonClick: function (e) {
            var min = parseInt(this.props.min, 10);
            var max = parseInt(this.props.max, 10);
            var current = parseInt(this.___getValue___(), 10);
            current = isNaN(current) ? min : current;
           
            var value = e.target.value;
            if (value + '' === current + '' || this.props.disabled) return;
            
            var v = 1;
            v = value === 'prev' ? current - 1 : value;
            v = v === 'next' ? current + 1 : v;
            v = parseInt(v, 10);
            v = v < min ? min : v;
            v = v > max ? max : v;

            e.target = this.refs.container;
            e.target.value = v;
            this.___dispatchChange___(e);
        },
        render: function () {
            var containerProp = cTools.containerBaseProps('pager', this);
            return (<div {...containerProp}>{factory.buttonFactory(this)}</div>);
        }
    });

});
