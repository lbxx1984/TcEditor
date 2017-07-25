/**
 * @file 主启动
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    const THREE = require('three');
    const ReactDOM = require('react-dom');
    const React = require('react');
    const _ = require('underscore');


    const emptyEditor = require('./emptyEditor');
    const config = require ('./config');
    const App = require('./App.jsx');
    const dispatcher = require('./dispatcher/index');
    const model = require('./core/model');
    const hotkey = require('./core/hotkey');


    model.fill(config);
    model.fill(emptyEditor);
    model.onChange = function (store) {
        render(store);
    };


    render(model.store);


    function render(store) {
        if (store.path.length) {
            document.title = config.editorTitle + ' ' +store.path.split('/').pop();
        }
        var props = _.extend({}, store, {dispatch: dispatch});
        ReactDOM.render(React.createElement(App, props), document.getElementById('main'));
    }


    function dispatch() {
        if (arguments.length === 0) return;
        var args = [].slice.apply(arguments);
        var handler = args.shift();
        if (typeof handler !== 'string') {
            args.unshift(handler);
            handler = typeof handler.type === 'string' ? handler.type : '';
        }
        if (typeof dispatcher[handler] === 'function') {
            return dispatcher[handler].apply(model, args);
        }
    }


});
