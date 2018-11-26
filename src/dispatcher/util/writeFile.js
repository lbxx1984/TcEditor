/**
 * @file 将文件写入本地缓存
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import JSZip from 'jszip';
import io from 'core/io';
import tcmExporter from 'core/exporter/tcm';
import {toast} from 'tcui/dialog';

export default function(path, model) {
    const fileContent = tcmExporter(model);
    const zip = new JSZip();
    zip.file('content', JSON.stringify(fileContent));
    return zip.generateAsync({type: 'blob'})
        .then(content => io.write(path, {data: content, append: false}))
        .then(function () {
            toast({
                type: 'success',
                message: 'File Saved.'
            });
        });
}
