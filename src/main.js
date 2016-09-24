/**
 * @file 主启动
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    // 核心依赖
    var ReactDOM = require('react-dom');
    var React = require('react');
    var App = require('./App.jsx');
    var _ = require('underscore');


    // 核心model
    var model = require('./model');


    model.set('a', 1);


    // 监听model
    model.onChange = function (store) {
        render(store);
    }


    // 渲染
    render(model.store);


    function render(store) {
        var props = _.extend({}, store);
        ReactDOM.render(React.createElement(App, props), document.getElementById('main'));
    }


});
