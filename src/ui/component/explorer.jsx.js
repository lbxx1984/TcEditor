define(function (require) {    

    return React.createClass({
        getDefaultProps : function () {
            return {
                button1: 'Open',
                button2: 'Cancel'
            };
        },
        getInitialState: function () {
            return {
                files: [],
                sorter: 0, // 0名称；1大小；2时间
                desc: 0 // 0升序；1降序
            }
        },
        componentDidMount: function () {
            this.listFiles();
        },
        sortList: function (e) {
            var sorter = ~~e.target.sorter;
            var desc = this.state.desc;
            if (sorter === this.state.sorter) {
                this.setState({desc: !desc});
            }
            else{
                this.setState({sorter: sorter, desc: 0});
            }
            this.listFiles();
        },
        listFiles: function () {
            var me = this;
            this.props.fs.dir(gotFiles);
            function gotFiles(result) {
                var infos = [];
                readMeta(0);
                function readMeta(i) {
                    if (i === result.length) {
                        infos.sort(sort);
                        if (me.state.desc) {
                            infos.reverse();
                        }
                        me.setState({files: infos});
                        return;
                    }
                    var item = result[i];
                    var obj = {
                        name: item.name,
                        isFile: item.isFile,
                        path: item.fullPath
                    };
                    item.getMetadata(function (meta) {
                        obj.mtime = meta.modificationTime;
                        obj.size = meta.size;
                        infos.push(obj);
                        readMeta(i + 1);
                    });
                }
            }
            function sort(a, b) {
                var compare = {
                    '0': function (a, b) {
                        return a.name.localeCompare(b.name);
                    },
                    '1': function (a, b) {
                        return a.size < b.size;
                    },
                    '2': function (a, b) {
                        return a.mtime.getTime() - b.mtime.getTime();
                    }
                }
                if (a.isFile && !b.isFile) {
                    return 1;
                }
                if (!a.isFile && b.isFile) {
                    return -1;
                }
                return compare[me.state.sorter + ''](a, b);
            }
        },
        deleteFile: function (e) {
            var me = this;
            if (e.target.dataset.isFile === 'true') {
                this.props.fs.del(e.target.dataset.path, result);
            }
            else {
                this.props.fs.deltree(e.target.dataset.path, result);
            }
            function result() {
                me.listFiles();
            }
        },
        closeHandler: function () {
            if (typeof this.props.onClose === 'function') {
                this.props.onClose();
            }
        },
        render: function () {
            var path = this.props.fs.getWorkingDirectory().fullPath.replace('/' + window.editorKey, '') + '/';
            var me = this;
            function mapFiles(item) {
                var isFile = item.isFile ? 'iconfont icon-wenjian' : 'iconfont icon-wenjianjia';
                var size = item.isFile ? formatSize(item.size) : '--';
                var deleteProp = {
                    'data-path': item.path,
                    'data-is-file': item.isFile,
                    title: 'Delete',
                    className: 'iconfont icon-shanchu',
                    onClick: me.deleteFile
                };
                return (
                    <div className="tr">
                        <div {...deleteProp}></div>
                        <div className="filename"><div className={isFile}></div>{item.name}</div>
                        <div className="filesize">{size}</div>
                        <div className="filetime">{item.mtime.format('YYYY/MM/DD hh:mm:ss')}</div>
                    </div>
                );
                function formatSize(n) {
                    var i = 0;
                    var unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
                    while (n > 1024) {
                        n = n / 1024;
                        i++;
                    }
                    return n.toFixed(i === 0 ? 0 : 2) + unit[i];
                }
            }
            return (
                <div className="explorer">
                    <div className="iconfont icon-xinjianwenjianjia"></div>
                    <div className="iconfont icon-wodedingdan35"></div>
                    <div className="address-bar">{path}</div>
                    <div className="tr th">
                        <div className="filename" data-sorter="0" onClick={this.sortList}>name</div>
                        <div className="filesize" data-sorter="1" onClick={this.sortList}>size</div>
                        <div className="filetime" data-sorter="2" onClick={this.sortList}>modify time</div>
                    </div>
                    <div className="filelist">
                        {this.state.files.map(mapFiles)}
                    </div>
                    <div className="foot-bar">
                        <div className="button" onClick={this.closeHandler}>{this.props.button2}</div>
                        <div className="button">{this.props.button1}</div>
                        file name:<input type="text"/>
                    </div>
                </div>
            );
        }
    });
});
