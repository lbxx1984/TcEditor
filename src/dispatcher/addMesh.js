/**
 * @file 添加物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import {getVectorLinkHash} from 'core/math';

export default function(obj3D) {
    const hash = {...this.get('mesh3d')};
    obj3D.tc = {
        birth: new Date(),
        add: true,
        group: this.get('activeGroup'),
        anchorColor: 0x00CD00,
        materialColor: obj3D.material.color.getHex(),
        materialEmissive: obj3D.material.emissive.getHex(),
        materialOpacity: obj3D.material.opacity,
        vectorLinkHash: getVectorLinkHash(obj3D.geometry)
    };
    hash[obj3D.uuid] = obj3D;
    this.set('mesh3d', hash);
}
