/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */

import HotkeyInfo from '../components/HotkeyInfo';


define(function (require) {
    const Dialog = require('fcui2/Dialog.jsx');
    const dialog = new Dialog();
    return {
        'help-hotkey': function () {
            dialog.pop({
                title: 'Hotkey Config',
                content: HotkeyInfo
            });
        }
    };
});
