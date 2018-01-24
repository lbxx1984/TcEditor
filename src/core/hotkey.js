/**
 * @file io处理工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */

import config from '../config';

const handlers = {};


function getHotKey(evt) {
    let result = '';
    if (evt.ctrlKey) {
        result = 'ctrl + ';
    }
    if (evt.altKey) {
        result += 'alt + ';
    }
    if (evt.shiftKey) {
        result += 'shift + ';
    }
    return result + evt.code.replace('Key', '').toLowerCase();
}


function on(type, callback) {
    if (typeof type !== 'string' || !type.length || typeof callback !== 'function') return;
    handlers[type] = handlers[type] || [];
    if (handlers[type].filter(func => func === callback).length) return;
    handlers[type].push(callback);
}


function un(type, callback) {
    if (typeof type !== 'string' || !type.length || typeof callback !== 'function') return;
    handlers[type] = handlers[type] || [];
    handlers[type] = handlers[type].filter(func => func !== callback);
}


function documentKeydownHandler(event) {
    const key = getHotKey(event);
    if (handlers[key] instanceof Array && handlers[key].length) {
        handlers[key].map(func => func());
    }
    if (config.arrestedHotKey.indexOf(key) > -1) {
        event.preventDefault();  
        window.event.returnValue = false;
        return false;
    }
}


document.body.addEventListener('keydown', documentKeydownHandler);


export default {
    on,
    un
}
