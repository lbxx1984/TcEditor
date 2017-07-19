/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    const _ = require('underscore');
    const Dialog = require('fcui2/Dialog.jsx');
    const Explorer = require('../components/dialogContent/Explorer.jsx');

    const tcmExporter = require('../core/exporter/tcm');

    const dialog = new Dialog();


    return {
        'file-save': function () {
            let me = this;
            tcmExporter(me);
            dialog.pop({
                contentProps: {
                    prefix: me.get('rootPrefix'),
                    root: me.get('root'),
                    mode: 'create',
                    onChange: onChange
                },
                content: Explorer,
                title: 'Save File'
            });
            function onChange(e) {
                // tcmExporter(me);
            }
        }
    };


});
