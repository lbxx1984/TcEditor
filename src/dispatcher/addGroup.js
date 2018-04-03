/**
 * @file 创建分组
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(groupname) {
    this.fill({
        group: [].concat(this.get('group'), [
            {label: groupname, expend: true}
        ]),
        activeGroup: groupname
    });
}
