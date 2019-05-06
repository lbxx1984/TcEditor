
export default function getToolsBarProps(props) {
    const pickMeshDatasource = JSON.parse(JSON.stringify(props.transformer3DTools));
    const pickJointDatasource = JSON.parse(JSON.stringify(props.morpher3DTools));
    if (props.transformer3Dinfo.mode === 'rotate') {
        pickMeshDatasource.pop();
    }
    let color = props.morpher3Dinfo.anchorColor.toString(16);
    while(color.length < 6) color = '0' + color;
    pickJointDatasource[0].color = '#' + color;
    return {
        pickMesh: {
            tool: props.tool,
            datasource: pickMeshDatasource,
            controls: props.transformer3Dinfo
        },
        pickJoint: {
            tool: props.tool,
            datasource: pickJointDatasource
        }
    };
}