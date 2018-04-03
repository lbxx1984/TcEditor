/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import ColorSetter from '../components/ColorSetter';
import Dialog from 'fcui2/src/Dialog.jsx';

export default function() {
    const dialog = new Dialog();
    dialog.pop({
        contentProps: {
            value: this.get('morpher3Dinfo').anchorColor,
            onChange: value => {
                const mesh = this.get('selectedMesh');
                mesh && mesh.tc && (mesh.tc.anchorColor = value);
                this.set('morpher3Dinfo', {
                    ...this.get('morpher3Dinfo'),
                    anchorColor: value
                });
            }
        },
        content: ColorSetter,
        title: 'Please Choose Anchor Color'
    });
}
