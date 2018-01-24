/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import io from 'core/io';
import tcmLoader from 'core/loader/tcm';
import tcmExporter from 'core/exporter/tcm';
import Explorer from '../components/Explorer';



define(function (require) {


    const _ = require('underscore');
    const Dialog = require('fcui2/Dialog.jsx');
    const Toast = require('fcui2/Toast.jsx');
    const FileSaver = require('FileSaver');
    const JSZip = require('jszip');


    const config = require('../config').default;
    const emptyEditorDataset = require('../emptyEditorDataset');




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

    function openFile(file, model) {
        if (_.keys(model.store.mesh3d).length) {
            dialog.confirm({
                title: 'Please Confirm',
                message: 'Clear the editor?',
                appSkin: 'oneux3',
                labels: {
                    enter: 'Yes',
                    cancel: 'No'
                },
                onEnter() {
                    clearEditor(model);
                    loadFileContent(file, model);
                },
                onCancel() {
                    loadFileContent(file, model);
                }
            });
        }
        else {
            clearEditor(model);
            loadFileContent(file, model);
        }
    }

    function clearEditor(me) {
        let dataset = {
            mesh3d: {},
            lights: {defaultLight: me.store.lights.defaultLight}
        };
        me.fill(dataset);
    }

    function loadFileContent(file, me) {
        let dataset = tcmLoader(me, file);
        me.fill(dataset);
        me.fill(file.editor);
    }

    return {

        'file-new'() {
            this.fill(_.extend({}, config, emptyEditorDataset));
            document.title = config.editorTitle;
        },

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
                            openFile(result, me);
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
