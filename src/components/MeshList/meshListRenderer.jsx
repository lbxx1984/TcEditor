/**
 * @file 物体列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React from 'react';
import meshRenderer from './meshRenderer';

export default function meshListRenderer(data, me) {
    const doms = [];
    data.map(function (group) {
        const delIcon = group.label === 'default group' || group.locked ? ' tc-icon-disabled' : '';
        const groupContainerProps = {
            'data-id': group.label,
            'data-level': 'group',
            className: 'folder-container' + (group.label === me.props.activeGroup ? ' active' : ''),
            onDragStart: me.onDragStart,
            onDragOver: me.onDragOver
        };
        const folderIconProps = {
            className: 'folder-icon tc-icon ' + (group.expend ? 'tc-icon-open-folder' : 'tc-icon-folder'),
            onClick: me.onFolderIconClick
        };
        const visibleIconProps = {
            className: 'visible-icon tc-icon ' + (group.visible ? 'tc-icon-visible' : 'tc-icon-invisible'),
            onClick: me.onVisibleIconClick
        };
        const lockIconProps = {
            className: 'tc-icon ' + (group.locked ? 'tc-icon-lock' : 'tc-icon-unlock'),
            onClick: me.onLockIconClick
        };
        const dragIconProps = {
            onMouseEnter: me.onDragIconEnter,
            onMouseLeave: me.onDragIconLeave,
            className: 'tc-icon tc-icon-drag'
        };
        const editIconProps = {
            className: 'tc-icon tc-icon-edit' + delIcon,
            onClick: delIcon ? undefined : me.onEditIconClick
        };
        const delIconProps = {
            className: 'tc-icon tc-icon-delete' + delIcon,
            onClick: delIcon ? undefined : me.onDelIconClick
        };
        const labelProps = {
            className: 'main-label',
            onClick: me.onLabelClick
        };
        doms.push(
            <div {...groupContainerProps} key={'group-contianer-' + group.label}>
                <span {...delIconProps}></span>
                <span {...dragIconProps}></span>
                <span {...editIconProps}></span>
                <span className="border-left">&nbsp;</span>
                <span {...folderIconProps}></span>
                <span {...visibleIconProps}></span>
                <span {...lockIconProps}></span>
                <div {...labelProps}>{group.label}</div>
            </div>
        );
        group.expend && group.children.map(mesh => meshRenderer(mesh, doms, me));
    });
    return doms;
}
