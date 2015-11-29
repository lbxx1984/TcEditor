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
                selected: '',
                files: [],
                sorter: 0, // 0名称；1大小；2时间
                desc: 0 // 0升序；1降序
            }
        },
        componentDidMount: function () {
            this.listFiles();
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
                        me.setState({files: infos, selected: ''});
                        return;
                    }
                    var item = result[i];
                    if (item.name.indexOf(window.editorKey) === 0) {
                        readMeta(i + 1);
                        return;
                    }
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
        itemClickHandler: function (e) {
            var dom = e.target;
            if (dom.title === 'deleteClickHandler') {
                return;
            }
            var path = dom.dataset.path;
            while (!path && dom != document.body) {
                dom = dom.parentNode;
                path = dom.dataset.path;
            }
            if (dom.dataset.isFile === 'true') {
                var filename = path.split('/').pop();
                if (filename === this.state.selected) {
                    this.enterClickHandler();
                    return;
                }
                this.setState({selected: filename});
            }
            else {
                var me = this;
                this.props.fs.cd(path, function () {
                    me.listFiles();
                });
            }
        },
        upClickHandler: function () {
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
        sortListHandler: function (e) {
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
        makeClickHandler: function () {
            var dom = this.refs.filelist.getDOMNode();
            lastScrollTop = dom.scrollTop;
            dom.scrollTop = dom.scrollHeight;
            var input = document.createElement('input');
            input.type = 'text';
            dom.appendChild(input);
            input.focus();
        },
        makeInputKeyUpHandler: function (e) {
            if (e.keyCode === 13) {
                var me = this;
                me.props.fs.md(e.target.value, function () {
                    me.removeMakeInputDom();
                });
                return;
            }
            if (e.keyCode === 27) {
                this.removeMakeInputDom();
                return;
            }
        },
        removeMakeInputDom: function () {
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
        deleteClickHandler: function (e) {
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
        enterClickHandler: function (e) {
            if (this.state.selected === '') {
                return;
            }
            var path = this.props.fs.getWorkingDirectory().fullPath + '/' + this.state.selected;
            var have = false;
            for (var i = 0; i < this.state.files.length; i++) {
                if (this.state.files[i].path === path) {
                    have = true;
                    break;
                }
            }
            if (this.props.mode === 'save'
                && have
                && !window.confirm('The file already exists, overwrite it?')
            ) {
                return;
            }
            if (this.props.mode !== 'save' && !have) {
                alert('File does not exist!');
                return;
            }
            if (typeof this.props.onEnter === 'function') {
                this.props.onEnter(path);
            }
        },
        closeClickHandler: function () {
            if (typeof this.props.onClose === 'function') {
                this.props.onClose();
            }
        },
        inputChangeHandler: function (e) {
            this.setState({selected: e.target.value});
        },
        render: function () {
            var me = this;
            var fileListProps = {
                className: 'filelist',
                ref: 'filelist',
                onKeyUp: this.makeInputKeyUpHandler,
                onBlur: this.removeMakeInputDom
            };
            function mapFiles(item) {
                var iconProp = {
                    className: item.isFile ? 'iconfont icon-wenjian' : 'iconfont icon-wenjianjia'
                };
                var deleteClickHandlerProp = {
                    'data-path': item.path,
                    'data-is-file': item.isFile,
                    title: 'deleteClickHandler',
                    className: 'iconfont icon-shanchu',
                    onClick: me.deleteClickHandler
                };
                var fileProp = {
                    'data-path': item.path,
                    'data-is-file': item.isFile,
                    className: 'tr',
                    onClick: me.itemClickHandler
                };
                return (
                    <div {...fileProp}>
                        <div {...deleteClickHandlerProp}></div>
                        <div><div {...iconProp}></div>{item.name}</div>
                        <div>{item.isFile ? formatSize(item.size) : '--'}</div>
                        <div>{item.mtime.format('YYYY/MM/DD hh:mm:ss')}</div>
                    </div>
                );
            }
            return (
                <div className="explorer">
                    <div className="iconfont icon-xinjianwenjianjia" onClick={this.makeClickHandler}></div>
                    <div className="iconfont icon-wodedingdan35" onClick={this.upClickHandler}></div>
                    <div className="address-bar">{
                        this.props.fs.getWorkingDirectory().fullPath.replace('/' + window.editorKey, '') + '/'
                    }</div>
                    <div className="th">
                        <div data-sorter="0" onClick={this.sortListHandler}>name</div>
                        <div data-sorter="1" onClick={this.sortListHandler}>size</div>
                        <div data-sorter="2" onClick={this.sortListHandler}>modify time</div>
                    </div>
                    <div {...fileListProps}>
                        {this.state.files.map(mapFiles)}
                    </div>
                    <div className="foot-bar">
                        <div className="button" onClick={this.closeClickHandler}>{this.props.button2}</div>
                        <div className="button" onClick={this.enterClickHandler}>{this.props.button1}</div>
                        file name:
                        <input type="text" value={this.state.selected} onChange={this.inputChangeHandler}/>
                    </div>
                </div>
            );
        }
    });
});

