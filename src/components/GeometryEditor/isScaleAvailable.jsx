/**
 * @file 物体编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function isScaleAvailable(a) {
    a = a + '';
    if (isNaN(a) || a === '' || a === '0' || a.charAt(a.length - 1) === '.') return false;
    a = a * 1;
    if (a <= 0) return false;
    return true; 
}
