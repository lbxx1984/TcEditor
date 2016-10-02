/**
 * @file 主模型
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {

    var _ = require('underscore');

    // 存储TcEditor运行期所有数据
    var model = {};

    function dispatchOnChange(me) {
        typeof me.onChange === 'function' && me.onChange(model);
    }

    return {

        store: model,

        /**
         * model发生变化后的回调
         */
        onChange: _.noop,

        /**
         * 批量修改model的域
         *
         * @param {Object} param 将要灌入model的数据集
         * @param {Boolean | undefined} slient 是否保持静默更新
         *      false：无条件触发onChange；true：不触发onChange；其他：自动判断
         */
        fill: function (param, slient) {
            var setted = false;
            if (slient === false) {
                model = this.store = _.extend({}, model, param);
                dispatchOnChange(this);
                return;
            }
            for (var key in param) {
                if (!param.hasOwnProperty(key)) continue;
                setted = this.set(key, param[key], true) || setted;
            }
            if (setted && !slient) {
                dispatchOnChange(this);
            }
        },

        /**
         * 修改model的某个域
         *
         * @param {string} key 域名
         * @param {Any} value 将要灌入到model的值
         * @param {Boolean | undefined} slient 是否保持静默更新
         *      false：无条件触发onChange；true：不触发onChange；其他：自动判断
         * @return {Boolean} value是否已经被灌入到model中
         */
        set: function (key, value, slient) {
            if (slient === false) {
                model[key] = value;
                dispatchOnChange(this);
                return true;
            } 
            if (_.isEqual(model[key], value)) {
                return false;
            }
            model[key] = value;
            if (!slient) {
                dispatchOnChange(this);
            }
            return true;
        }
    };

});
