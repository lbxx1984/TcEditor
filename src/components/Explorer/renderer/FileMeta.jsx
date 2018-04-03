/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import util from 'fcui2/core/util';


function formatSize(n) {
    const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
    let i = 0; 
    while (n > 1024) {n = n / 1024; i++;}
    return n.toFixed(i === 0 ? 0 : 2) + unit[i];
}


export default class FileMeta extends Component {

    static propTypes = {
        item: PropTypes.object.isRequired,
        field: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
        this.getMeta = this.getMeta.bind(this);
        this.state = {
            mtime: 0,
            size: '-'
        };
    }

    componentDidMount() {
        this.getMeta(this.props.item);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.item !== this.props.item) this.getMeta(nextProps.item);
    }

    getMeta(item) {
        item.getMetadata(meta => {
            this.setState({
                mtime: util.dateFormat(meta.modificationTime, 'YYYY/MM/DD hh:mm:ss'),
                size: this.props.item.isDirectory ? '-' : formatSize(meta.size)
            });
        });
    }

    render() {
        return (
            <td className="file-meta" key={this.props.item.fullPath}>
                {this.state[this.props.field]}
            </td>
        );
    }
}
