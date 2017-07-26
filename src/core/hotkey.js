/**
 * @file io处理工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    const handlers = {};
    const config = require('../config');


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
    };


    document.body.addEventListener('keydown', function (event) {
        let key = getHotKey(event);
        if (handlers[key] instanceof Array && handlers[key].length) {
            handlers[key].map(func => func());
        }
        if (config.arrestedHotKey.indexOf(key) > -1) {
            event.preventDefault();  
            window.event.returnValue = false;
            return false;
        }
    });


    return {
        on(type, callback) {
            if (typeof type !== 'string' || !type.length || typeof callback !== 'function') return;
            handlers[type] = handlers[type] || [];
            let has = handlers[type].filter(func => func === callback);
            if (has.length) return;
            handlers[type].push(callback);
        },
        un(type, callback) {
            if (typeof type !== 'string' || !type.length || typeof callback !== 'function') return;
            handlers[type] = handlers[type] || [];
            handlers[type] = handlers[type].filter(func => func !== callback);
        }
    };

});
