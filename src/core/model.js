/**
 * @file 主模型
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import equal from 'fast-deep-equal';

let store = {};

function dispatchOnChange(me) {
    typeof me.onChange === 'function' && me.onChange(store);
}

export default {
    store,
    onChange: new Function(),
    /**
     * 批量修改model的域
     *
     * @param {Object} param 将要灌入model的数据集
     * @param {Boolean | undefined} slient 是否保持静默更新
     *      false：无条件触发onChange；true：不触发onChange；其他：自动判断
     */
    fill(param, slient) {
        let setted = false;
        if (slient === false) {
            store = this.store = {
                ...store,
                ...param
            };
            dispatchOnChange(this);
            return;
        }
        Object.keys(param).map(key => {
            setted = this.set(key, param[key], true) || setted;
        });
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
    set(key, value, slient) {
        if (slient === false) {
            store[key] = value;
            dispatchOnChange(this);
            return true;
        } 
        if (equal(store[key], value)) {
            return false;
        }
        store[key] = value;
        if (!slient) {
            dispatchOnChange(this);
        }
        return true;
    },
    /**
     * 获取model中的数据
     *
     * @param {string} key 域名
     */
    get(key) {
        return store[key];
    }
}
