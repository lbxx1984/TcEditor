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
    const JSZip = require('jszip');


    const Explorer = require('../components/dialogContent/Explorer.jsx');
    const io = require('../core/io');


    const tcmLoader = require('../core/loader/tcm');
    const tcmExporter = require('../core/exporter/tcm');


    const dialog = new Dialog();


    function missionFailed() {
        Toast.pop({
            type: 'error',
            message: 'Mission failed.'
        });
    }

    function writeFile(path, model) {
        let fileContent = tcmExporter(model);
        let zip = new JSZip();
        zip.file('content', JSON.stringify(fileContent));
        return zip.generateAsync({type: 'blob'})
        .then(content => io.write(path, {data: content, append: false}))
        .then(function () {
            Toast.pop({
                type: 'success',
                message: 'File Saved.',
                autoHideTime: '500'
            });
        });
    }

    function readFile(path) {
        return io.read(path, {type: 'readAsArrayBuffer'})
        .then(res => (new JSZip()).loadAsync(res.target.result))
        .then(zip => zip.file('content').async('string'))
        .then(function (content) {
            try {
                content = JSON.parse(content);
            }
            catch(e) {
                content = null;
            }
            return new Promise(function (resolve, reject) {
                content ? resolve(content) : reject();
            });
        });
    }

    function getFilePathThenSave(me, dialogTitle) {
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

        'file-open'() {
            let me = this;
            dialog.pop({
                contentProps: {
                    prefix: me.get('rootPrefix'),
                    root: me.get('root'),
                    extension: 'tcm',
                    mode: 'file',
                    onChange(e) {
                        readFile(e.selected).then(function (result) {
                            me.fill({
                                root: e.root,
                                path: e.selected
                            });
                            // todo：load tcm
                            console.log(result);
                        }, missionFailed);
                    },
                    onClose(e) {
                        me.set('root', e.root);
                    }
                },
                content: Explorer,
                title: 'Open'
            });
        },

        'file-save'() {
            let me = this;
            let path = me.store.path;
            if (!path) {
                getFilePathThenSave(me, 'Save');
                return;
            }
            io.open(path).then(function () {
                writeFile(path, me);
            }, function () {
                getFilePathThenSave(me, 'Save');
            });
        },

        'file-saveAs'() {
            getFilePathThenSave(this);
        },

        'file-import'() {
            let me = this;
            io.uploadFromBrowser('tcm')
            .then(res => (new JSZip()).loadAsync(res.target.result))
            .then(zip => zip.file('content').async('string'))
            .then(function (content) {
                try {
                    content = JSON.parse(content);
                }
                catch (e) {
                    content = null;
                    missionFailed();
                    return;
                }
                if (!content) return;
                let dataset = tcmLoader(me, content);
                me.fill(dataset);
            }, missionFailed);
        },

        'file-export'() {
            let fileContent = tcmExporter(this);
            let zip = new JSZip();
            let filename = this.store.path ? this.store.path.split('/').pop() : 'tcModel.tcm';
            zip.file('content', JSON.stringify(fileContent));
            return zip.generateAsync({type: 'blob'}).then(function (content) {
                FileSaver(content, filename);
            });
        }

    };


});
