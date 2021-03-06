/**
 * @file 主启动
 * @author Brian Li
 * @email lbxxlht@163.com
 */
/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom';
import React from 'react';
import model from 'core/model';
import 'date-format-lite';
import config, {EMPTY_EDITOR_DATASET} from './config';
import dispatcher from './dispatcher';
import hotkeySystem from './hotkeySystem';
import App from './App';
import './css/main.less';


// 渲染页面
function render(store) {
    if (store.path.length) {
        document.title = config.editorTitle + ' ' +store.path.split('/').pop();
    }
    const props = Object.assign({}, store, {dispatch: dispatch});
    ReactDOM.render(React.createElement(App, props), document.getElementById('main'));
}


// 响应交互
function dispatch() {
    if (arguments.length === 0) return;
    const args = [].slice.apply(arguments);
    let handler = args.shift();
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
model.fill(EMPTY_EDITOR_DATASET);
// 挂载model事件
model.onChange = store => render(store);
// 挂载快捷键
hotkeySystem(model, dispatcher);
// 启动页面
render(model.store);
