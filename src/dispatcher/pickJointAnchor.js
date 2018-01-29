/**
 * @file 将关节器锚点放入model
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(anchor) {
    if (anchor && anchor.tc) {
        this.fill({
            selectedVectorIndex: anchor.tc.index,
            selectedVector: anchor
        });
    }
    else {
        this.set('selectedVectorIndex', anchor);
    }
}
