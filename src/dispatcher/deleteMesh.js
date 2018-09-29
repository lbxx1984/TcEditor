/**
 * @file 删除物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import Dialog from 'tcui/Dialog';
import hotkey from 'core/hotkey';

export default function(uuid) {
    const me = this;
    const dialog = new Dialog();
    dialog.confirm({
        title: 'Please Confirm',
        message: '<h4>Are you sure to remove this mesh?</h4>',
        appSkin: 'oneux3',
        labels: {
            enter: 'Yes',
            cancel: 'No'
        },
        onClose: () => hotkey.un('enter', run),
        onEnter: () => run()
    });
    hotkey.on('enter', run);
    function run() {
        dialog.close();
        hotkey.un('enter', run);
        const mesh3d = {...me.get('mesh3d')};
        const selectedMesh = me.get('selectedMesh');
        const dataset = {mesh3d};
        delete mesh3d[uuid];
        if (selectedMesh && selectedMesh.uuid === uuid) {
            dataset.selectedMesh = null;
            dataset.selectedVector = null;
            dataset.selectedVectorIndex = -1;
        }
        me.fill(dataset);
    }
}
