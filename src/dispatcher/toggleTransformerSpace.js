/**
 * @file 切换变换工具坐标系
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function() {
    const info = this.get('transformer3Dinfo');
    this.set('transformer3Dinfo', {
        ...info,
        space: info.space === 'world' ? 'local' : 'world'

    });
}
