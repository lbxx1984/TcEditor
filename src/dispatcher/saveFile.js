/**
 * @file 保存文件
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import io from 'core/io';
import getFilePathThenSave from './util/getFilePathThenSave';
import writeFile from './util/writeFile';

export default function() {
    const me = this;
    const path = me.store.path;
    if (!path) {
        getFilePathThenSave(me, 'Save');
        return;
    }
    io.open(path).then(function () {
        writeFile(path, me);
    }, function () {
        getFilePathThenSave(me, 'Save');
    });
}
