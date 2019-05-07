import React from 'react';
import BaseComponent from './core/BaseComponent';
import './css/Table.less';


function renderTable(me, shadow) {
    const {fieldConfig, datasource, hideTableHeader, noDataRenderer: NoData} = me.props;
    if (!(fieldConfig instanceof Array)) return null;
    const colgroup = () => fieldConfig.map((item, index) => {
        return <col style={{width: `${item.width}px`, maxWidth: `${item.width}px`}} key={`col-${index}`}/>;
    });
    const thead = () => fieldConfig.map((item, index) => {
        const props = {...item, me, key: `th-${index}`};
        const {thRenderer: Renderer, label} = item;
        return Renderer ? <Renderer {...props}/> : <th key={`th-${index}`}>{label}</th>;
    });
    const tbody = () => {
        if (!(datasource instanceof Array) || !datasource.length) {
            return NoData ? <tr><td><NoData/></td></tr> : null;
        }
        return datasource.map((data, row) => <tr key={`tr-${row}`}>{fieldConfig.map((fieldConfig, column) => {
            const key = `td-${row}-${column}`;
            const props = {fieldConfig, data, me, row, column};
            const {field, renderer: Renderer} = fieldConfig;
            if (!Renderer) return <td key={key}>{`${data[field]}`}</td>;
            return <Renderer {...props} key={key}/>;
        })}</tr>);
    };
    return shadow ? <table cellSpacing="0" cellPadding="0" className="shadow-table" ref="shadowTableHead">
        <colgroup>{colgroup()}</colgroup>
        <tbody>
            {tbody()}
            {hideTableHeader ? null : <tr className="table-head">{thead()}</tr>}
        </tbody>
    </table> : <table cellSpacing="0" cellPadding="0">
        <colgroup>{colgroup()}</colgroup>
        <tbody>
            {hideTableHeader ? null : <tr className="table-head">{thead()}</tr>}
            {tbody()}
        </tbody>
    </table>;
}


function updateHeadPosition(table) {
    const head = table.getElementsByClassName('table-head');
    if (!head.length) {
        table.style.top = '-9999px';
        return;
    }
    table.style.top = (head[0].offsetHeight - table.offsetHeight) + 'px';
}


export default class Table extends BaseComponent {

    static propTypes = {}

    constructor(args) {
        super(args);
        this.name = 'Table';
    }

    componentDidUpdate() {
        updateHeadPosition(this.refs.shadowTableHead);
    }

    render() {
        const containerProps = this.getContainerBaseProps(this);
        return <div {...containerProps}>
            <div className="real-table-container">{renderTable(this)}</div>
            {renderTable(this, true)}
        </div>;
    }
}
