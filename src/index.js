/**
 * @file 主启动
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import ReactDOM from 'react-dom';
import React from 'react';
import model from 'core/model';
import config from './config';
import emptyEditorDataset from './emptyEditorDataset';
import dispatcher from './dispatcher';
import hotkeySystem from './hotkeySystem';
import App from './App';
import './css/main.less';


// 渲染页面
function render(store) {
    if (store.path.length) {
        document.title = config.editorTitle + ' ' +store.path.split('/').pop();
    }
    let props = Object.assign({}, store, {dispatch: dispatch});
    ReactDOM.render(React.createElement(App, props), document.getElementById('main'));
}


// 响应交互
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


// 配置原始数据
model.fill(config);
model.fill(emptyEditorDataset);
// 挂载model事件
model.onChange = store => render(store);
// 挂载快捷键
hotkeySystem(model, dispatcher);
// 启动页面
render(model.store);
