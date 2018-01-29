/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import addGroup from './addGroup';
import addMesh from './addMesh';
import changeActiveGroup from './changeActiveGroup';
import changeCamera3D from './changeCamera3D';
import changeMeshGroup from './changeMeshGroup';
import changeMouse3D from './changeMouse3D';
import changeTool from './changeTool';
import changeView from './changeView';
import clearSelected from './clearSelected';
import closePanel from './closePanel';
import createPlane from './createPlane';
import createSphere from './createSphere';
import deleteGroup from './deleteGroup';
import deleteLight from './deleteLight';
import deleteMesh from './deleteMesh';
import enlargeGrid from './enlargeGrid';
import lockGroup from './lockGroup';
import lockLight from './lockLight';
import lockMesh from './lockMesh';
import moveCamera from './moveCamera';
import moveCamera2D from './moveCamera2D';
import moveGroup from './moveGroup';
import narrowGrid from './narrowGrid';
import openPanel from './openPanel';
import popHotkeyInfo from './popHotkeyInfo';
import renameGroup from './renameGroup';
import resetCamera from './resetCamera';
import toggleGroup from './toggleGroup';
import toggleGroupVisibility from './toggleGroupVisibility';
import toggleHelper from './toggleHelper';
import toggleLightVisibility from './toggleLightVisibility';
import toggleMeshVisibility from './toggleMeshVisibility';
import togglePanel from './togglePanel';
import updateTimer from './updateTimer';
import zoomInCamera from './zoomInCamera';
import zoomOutCamera from './zoomOutCamera';


define(function (require) {

    const _ = require('underscore');

    return _.extend(
        {},
        require('./tool'),
        require('./transformer'),
        require('./morpher'),
        require('./file'),
        {
            addGroup,
            addMesh,
            changeActiveGroup,
            changeCamera3D,
            changeMeshGroup,
            changeMouse3D,
            changeTool,
            changeView,
            clearSelected,
            closePanel,
            createPlane,
            createSphere,
            deleteGroup,
            deleteLight,
            deleteMesh,
            enlargeGrid,
            lockGroup,
            lockLight,
            lockMesh,
            moveCamera,
            moveCamera2D,
            moveGroup,
            narrowGrid,
            openPanel,
            popHotkeyInfo,
            renameGroup,
            resetCamera,
            toggleGroup,
            toggleGroupVisibility,
            toggleHelper,
            toggleLightVisibility,
            toggleMeshVisibility,
            togglePanel,
            updateTimer,
            zoomInCamera,
            zoomOutCamera
        }
    );

});
