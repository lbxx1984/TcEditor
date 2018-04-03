/**
 * @file 导出文件
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import JSZip from 'jszip';
import FileSaver from 'FileSaver';
import tcmExporter from 'core/exporter/tcm';

export default function() {
    let fileContent = tcmExporter(this);
    let zip = new JSZip();
    let filename = this.store.path ? this.store.path.split('/').pop() : 'tcModel.tcm';
    zip.file('content', JSON.stringify(fileContent));
    return zip.generateAsync({type: 'blob'}).then(function (content) {
        FileSaver(content, filename);
    });
}
