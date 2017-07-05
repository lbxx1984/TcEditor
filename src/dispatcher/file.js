/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');
    var Dialog = require('fcui2/Dialog.jsx');
    var Explorer = require('../components/dialogContent/Explorer.jsx');
    var dialog = new Dialog();

    return {
        'file-save': function () {
            dialog.pop({
                contentProps: {
                    prefix: this.get('rootPrefix'),
                    root: this.get('root')
                },
                content: Explorer,
                title: 'Save File'
            });
        }
    };


});
