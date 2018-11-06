/**
 * @file 打开文件
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import JSZip from 'jszip';
import dialog from 'tcui/dialog';
import Toast from 'tcui/Toast';
import io from 'core/io';
import tcmLoader from 'core/loader/tcm';
import Explorer from '../components/Explorer';


function missionFailed() {
    Toast.pop({
        type: 'error',
        message: 'Open File Failed.'
    });
}

function clearEditor(me) {
    me.fill({
        mesh3d: {},
        lights: {defaultLight: me.store.lights.defaultLight}
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

function loadFileContent(file, me) {
    const dataset = tcmLoader(me, file);
    me.fill(dataset);
    me.fill(file.editor);
}

function openFile(file, model) {
    if (Object.keys(model.store.mesh3d).length) {
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


export default function() {
    const me = this;
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
}
