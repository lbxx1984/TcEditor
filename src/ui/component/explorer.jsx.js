define(function (require) {
    var lastScrollTop = 0;
    // 转换文件大小
    function formatSize(n) {
        var i = 0;
        var unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
        while (n > 1024) {
            n = n / 1024;
            i++;
        }
        return n.toFixed(i === 0 ? 0 : 2) + unit[i];
    }
    return React.createClass({
        getDefaultProps : function () {
            return {
                button1: 'Open',
                button2: 'Cancel'
            };
        },
        getInitialState: function () {
            return {
                selectedPath: '',
                selected: '',
                files: [],
                sorter: 0, // 0名称；1大小；2时间
                desc: 0 // 0升序；1降序
            }
        },
        componentDidMount: function () {
            this.listFiles();
        },
        itemClick: function (e) {
            var dom = e.target;
            if (dom.title === 'Delete') {
                return;
            }
            var path = dom.dataset.path;
            while (!path && dom != document.body) {
                dom = dom.parentNode;
                path = dom.dataset.path;
            }
            if (dom.dataset.isFile === 'true') {
                var arr = path.split('/');
                var filename = arr.pop();
                if (filename === this.state.selected) {
                    this.enterHandler();
                    return;
                }
                this.setState({
                    selectedPath: path,
                    selected: filename
                });
            }
            else {
                var me = this;
                this.props.fs.cd(path, function () {
                    me.listFiles();
                });
            }
        },
        toParentDir: function () {
            var arr = this.props.fs.getWorkingDirectory().fullPath.split('/');
            arr.pop();
            var path = arr.join('/');
            if (path.indexOf(window.editorKey) < 0) {
                return;
            }
            var me = this;
            this.props.fs.cd(path, function () {
                me.listFiles();
            });
        },
        listFiles: function () {
            var me = this;
            this.props.fs.dir(gotFiles);
            function gotFiles(result) {
                var infos = [];
                readMeta(0, me);
                function readMeta(i) {
                    if (i === result.length) {
                        infos.sort(sort);
                        if (me.state.desc) {
                            infos.reverse();
                        }
                        me.setState({
                            files: infos,
                            selected: ''
                        });
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
            // 文件列表排序方法
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
        makeDir: function () {
            var dom = this.refs.filelist.getDOMNode();
            lastScrollTop = dom.scrollTop;
            dom.scrollTop = dom.scrollHeight;
            var input = document.createElement('input');
            input.type = 'text';
            dom.appendChild(input);
            input.focus();
        },
        makeDirKeyUp: function (e) {
            if (e.keyCode === 13) {
                var me = this;
                me.props.fs.md(e.target.value, function () {
                    me.makeDirRemoveInput();
                });
                return;
            }
            if (e.keyCode === 27) {
                this.makeDirRemoveInput();
                return;
            }
        },
        makeDirRemoveInput: function () {
            var dom = this.refs.filelist.getDOMNode();
            try {
                var input = dom.getElementsByTagName('input');
                for (var i = 0; i < input.length; i++) {
                    dom.removeChild(input[i]);
                }
            }
            catch (e) {

            }
            dom.scrollTop = lastScrollTop;
            this.listFiles();
        },
        delete: function (e) {
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
        enterHandler: function (e) {
            if (this.state.selected === '') {
                return;
            }
            if (typeof this.props.onEnter === 'function') {
                this.props.onEnter(this.state.selectedPath);
            }
        },
        closeHandler: function () {
            if (typeof this.props.onClose === 'function') {
                this.props.onClose();
            }
        },
        render: function () {
            var me = this;
            var fileListProps = {
                className: 'filelist',
                ref: 'filelist',
                onKeyUp: this.makeDirKeyUp,
                onBlur: this.makeDirRemoveInput
            };
            function mapFiles(item) {
                var iconProp = {
                    className: item.isFile ? 'iconfont icon-wenjian' : 'iconfont icon-wenjianjia'
                };
                var deleteProp = {
                    'data-path': item.path,
                    'data-is-file': item.isFile,
                    title: 'Delete',
                    className: 'iconfont icon-shanchu',
                    onClick: me.delete
                };
                var fileProp = {
                    'data-path': item.path,
                    'data-is-file': item.isFile,
                    className: 'tr',
                    onClick: me.itemClick
                };
                return (
                    <div {...fileProp}>
                        <div {...deleteProp}></div>
                        <div><div {...iconProp}></div>{item.name}</div>
                        <div>{item.isFile ? formatSize(item.size) : '--'}</div>
                        <div>{item.mtime.format('YYYY/MM/DD hh:mm:ss')}</div>
                    </div>
                );
            }
            return (
                <div className="explorer">
                    <div className="iconfont icon-xinjianwenjianjia" onClick={this.makeDir}></div>
                    <div className="iconfont icon-wodedingdan35" onClick={this.toParentDir}></div>
                    <div className="address-bar">{
                        this.props.fs.getWorkingDirectory().fullPath.replace('/' + window.editorKey, '') + '/'
                    }</div>
                    <div className="th">
                        <div data-sorter="0" onClick={this.sortList}>name</div>
                        <div data-sorter="1" onClick={this.sortList}>size</div>
                        <div data-sorter="2" onClick={this.sortList}>modify time</div>
                    </div>
                    <div {...fileListProps}>
                        {this.state.files.map(mapFiles)}
                    </div>
                    <div className="foot-bar">
                        <div className="button" onClick={this.closeHandler}>{this.props.button2}</div>
                        <div className="button" onClick={this.enterHandler}>{this.props.button1}</div>
                        file name:<input type="text" value={this.state.selected}/>
                    </div>
                </div>
            );
        }
    });
});

