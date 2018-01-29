/**
 * @file 设置变形器工作模式
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(mode) {
    this.set('transformer3Dinfo', {
        ...this.get('transformer3Dinfo'),
        mode
    });
}
