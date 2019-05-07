/**
 * @file io处理工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */

import config, {IS_MAC} from '../config';

const handlers = {};
let commandKeyDown = false;

function getHotKey(evt) {
    let result = '';
    if ((!IS_MAC && evt.ctrlKey) || (IS_MAC && commandKeyDown)) {
        result = 'ctrl + ';
    }
    if (evt.altKey) {
        result += 'alt + ';
    }
    if (evt.shiftKey) {
        result += 'shift + ';
    }
    result += evt.code.replace('Key', '').toLowerCase();
    return result;
}


function on(type, callback) {
    if (typeof type !== 'string' || !type.length || typeof callback !== 'function') return;
    type = type.indexOf(',') > -1 ? type.split(',') : [type];
    type.forEach(key => {
        handlers[key] = handlers[key] || [];
        if (handlers[key].filter(func => func === callback).length) return;
        handlers[key].push(callback);
    });
}


function un(type, callback) {
    if (typeof type !== 'string' || !type.length || typeof callback !== 'function') return;
    type = type.indexOf(',') > -1 ? type.split(',') : [type];
    type.forEach(key => {
        handlers[key] = handlers[key] || [];
        handlers[key] = handlers[key].filter(func => func !== callback);
    });
}


function documentKeydownHandler(event) {
    if (event.code.indexOf('Meta') === 0) {
        commandKeyDown = true;
    }
    const key = getHotKey(event);
    if (handlers[key] instanceof Array && handlers[key].length) {
        handlers[key].map(func => func());
    }
    if (config.arrestedHotKey.indexOf(key) > -1) {
        event.preventDefault();  
        return false;
    }
}

function documentKeyupHandler(event) {
    if (event.code.indexOf('Meta') === 0) {
        commandKeyDown = false;
    }
}

document.body.addEventListener('keydown', documentKeydownHandler);
document.body.addEventListener('keyup', documentKeyupHandler);

export default {on, un}
