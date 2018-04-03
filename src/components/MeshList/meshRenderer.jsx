/**
 * @file 物体列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React from 'react';
import util from 'fcui2/core/util';

export default function meshRenderer(mesh, doms, me) {
    const tc = mesh.tc;
    const name = tc.name || mesh.geometry.type.replace('Geometry', ' ')
        + util.dateFormat(tc.birth, 'DD/MM hh:mm:ss');
    const containerProps = {
        key: mesh.uuid,
        className: 'mesh-container'
            + (me.props.selectedMesh && me.props.selectedMesh.uuid === mesh.uuid ? ' mesh-selected' : ''),
        'data-id': mesh.uuid,
        'data-level': 'mesh',
        onDragStart: me.onDragStart,
        onDragOver: me.onDragOver
    };
    const visibleIconProps = {
        className: 'visible-icon tc-icon ' + (mesh.visible ? 'tc-icon-visible' : 'tc-icon-invisible'),
        onClick: me.onVisibleIconClick
    };
    const dragIconProps = {
        onMouseEnter: me.onDragIconEnter,
        onMouseLeave: me.onDragIconLeave,
        className: 'tc-icon tc-icon-drag'
    };
    const delIconProps = {
        className: 'tc-icon tc-icon-delete',
        onClick: me.onDelIconClick
    };
    const lockedIconProps = {
        className: 'tc-icon ' + (tc.locked ? 'tc-icon-lock' : 'tc-icon-unlock'),
        onClick: me.onLockIconClick
    };
    const labelProps = {
        className: 'main-label',
        onClick: me.onLabelClick
    };
    doms.push(
        <div {...containerProps}>
            <span {...delIconProps}></span>
            <span {...dragIconProps}></span>
            <span {...visibleIconProps}></span>
            <span {...lockedIconProps}></span>
            <div {...labelProps}>{name}</div>
        </div>
    );
}
