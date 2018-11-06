/**
 * @file 获取文件路径并保存文件
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import Toast from 'tcui/Toast';
import dialog from 'tcui/dialog';
import Explorer from '../../components/Explorer';
import writeFile from './writeFile';

function missionFailed() {
    Toast.pop({
        type: 'error',
        message: 'Write File Failed.'
    });
}

export default function(me, dialogTitle) {
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
