/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    const Dialog = require('fcui2/Dialog.jsx');
    const HotkeyInfo = require('../components/dialogContent/HotkeyInfo.jsx');
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
