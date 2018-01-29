/**
 * @file 设置变形器锚点尺寸
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(enlarge) {
    const info = this.get('transformer3Dinfo');
    this.set('transformer3Dinfo', {
        ...info,
        size: enlarge ? info.size + 0.1 : Math.max(info.size - 0.1, 0.1)
    });
}
