/**
 * @file 设置关节器锚点尺寸
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(enlarge) {
    const info = this.get('morpher3Dinfo');
    let anchorSize = info.anchorSize;
    if (enlarge) {
        anchorSize = anchorSize / 1.1;
        anchorSize = Math.max(anchorSize, 500);
    }
    else {
        anchorSize = anchorSize * 1.1;
        anchorSize = Math.min(anchorSize, 1000);
    }   
    this.set('morpher3Dinfo', {
        ...info,
        anchorSize
    });
}
