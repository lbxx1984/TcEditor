/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    const _ = require('underscore');
    const Dialog = require('fcui2/Dialog.jsx');
    const Toast = require('fcui2/Toast.jsx');
    const FileSaver = require('FileSaver');

    const Explorer = require('../components/dialogContent/Explorer.jsx');
    const tcmExporter = require('../core/exporter/tcm');
    const io = require('../core/io');

    const dialog = new Dialog();


    function missionFailed() {
        Toast.pop({
            type: 'error',
            message: 'Mission failed.'
        });
    }


    function writeFile(path, model) {
        let fileContent = tcmExporter(model);
        return io.write(path, {
            data: new Blob([JSON.stringify(fileContent, null, 4)], {type: 'text/plain;charset=utf-8'}),
            append: false
        });
    }


    function saveAs(me, dialogTitle) {
        dialog.pop({
            contentProps: {
                prefix: me.get('rootPrefix'),
                root: me.get('root'),
                extension: 'tcm',
                mode: 'create',
                onChange(e) {
                    writeFile(e.selected, me).then(function () {
                        me.fill({
                            root: e.root,
                            path: e.selected
                        });
                    }, missionFailed);
                },
                onClose(e) {
                    me.set('root', e.root);
                }
            },
            content: Explorer,
            title: dialogTitle || 'Save As'
        });
    }


    return {

        'file-save'() {
            let me = this;
            let path = me.store.path;
            if (!path) {
                saveAs(me, 'Save');
                return;
            }
            io.open(path).then(function () {
                writeFile(path, me);
            }, function () {
                saveAs(me, 'Save');
            });
        },

        'file-saveAs'() {
            saveAs(this);
        }

    };


});
