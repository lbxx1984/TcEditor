/**
 * @file 导入文件
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import JSZip from 'jszip';
import io from 'core/io';
import tcmLoader from 'core/loader/tcm';

function missionFailed() {
    // Toast.pop({
    //     type: 'error',
    //     message: 'Import File Failed.'
    // });
}

export default function() {
    const me = this;
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
            me.fill(tcmLoader(me, content));
        }, missionFailed);
}
