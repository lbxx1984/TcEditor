/**
 * @file 将文件写入本地缓存
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import JSZip from 'jszip';
import Toast from 'tcui/Toast';
import io from 'core/io';
import tcmExporter from 'core/exporter/tcm';


export default function(path, model) {
    const fileContent = tcmExporter(model);
    const zip = new JSZip();
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
