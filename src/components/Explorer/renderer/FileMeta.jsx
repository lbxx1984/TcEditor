/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';


function formatSize(n) {
    const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
    let i = 0; 
    while (n > 1024) {n = n / 1024; i++;}
    return n.toFixed(i === 0 ? 0 : 2) + unit[i];
}


export default class FileMeta extends Component {

    static propTypes = {
        data: PropTypes.object,
        fieldConfig: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.getMeta = this.getMeta.bind(this);
        this.state = {mtime: 0, size: '-'};
    }

    componentDidMount() {
        this.getMeta(this.props.data);
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) this.getMeta(this.props.data);
    }

    getMeta(item) {
        item.getMetadata(meta => {
            this.setState({
                mtime: meta.modificationTime.format('YYYY/MM/DD hh:mm:ss'),
                size: item.isDirectory ? '-' : formatSize(meta.size)
            });
        });
    }

    render() {
        return (
            <td className="file-meta" key={this.props.data.fullPath}>
                {this.state[this.props.fieldConfig.field]}
            </td>
        );
    }
}
