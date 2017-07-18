/**
 * @file 浏览器文件沙箱
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var Dialog = require('fcui2/Dialog.jsx');
    var Toast = require('fcui2/Toast.jsx');
    var TextBox = require('fcui2/TextBox.jsx');
    var Table = require('fcui2/Table.jsx');
    var Button = require('fcui2/Button.jsx');


    var FileName = require('../renderer/FileName.jsx');
    var FileMeta = require('../renderer/FileMeta.jsx');
    var FileOperation = require('../renderer/FileOperation.jsx');
    var NoData = require('../renderer/TableNoDataRenderer.jsx');
    var NameCreator = require('./NameCreator.jsx');


    var _ = require('underscore');
    var io = require('../../core/io');
    var uiUtil = require('fcui2/core/util');


    var dialog = new Dialog();
    var tableFieldConfig = [
        {
            label: 'name',
            field: 'name',
            width: 300,
            renderer: FileName,
            prepare: function (props, item, row, column, me) {
                props.clipboard = me.props.clipboard;
            }
        },
        {
            label: 'size',
            field: 'size',
            width: 60,
            renderer: FileMeta
        },
        {
            label: 'time',
            field: 'mtime',
            width: 140,
            renderer: FileMeta
        },
        {
            label: ' ',
            field: 'operation',
            width: 30,
            renderer: FileOperation
        }
    ];


    function missionFailed() {
        Toast.pop({
            type: 'error',
            message: 'Mission failed.'
        });
    }


    return React.createClass({

        // @override
        getDefaultProps: function () {
            return {
                // 目录前缀
                prefix: '',
                // 当前所处目录
                root: '',
                // 工作模式
                //      dir，选择目录
                //      file，选择文件，不可创建新文件，即输入框无法编辑
                //      create，创建一个新文件或者选中一个已有文件将其覆盖
                mode: 'dir',
                onChange: new Function(),
                onClose: new Function()
            };
        },

        // @override
        getInitialState: function () {
            return {
                // 当前目录绝对路径
                path: this.props.prefix + '/' + this.props.root,
                // 显示给用户却掉前缀的相对路径，用于响应用户输入
                root: this.props.root,
                // 当前目录结构
                directory: [],
                // 选中的目录或文件，如果处于create工作模式，此项可被编辑
                selected: this.props.mode === 'dir' ? this.props.prefix + '/' + this.props.root : '',
                // 剪切板
                clipboard: '',
                // 剪切板内容是否为目录
                clipboardIsDirectory: false,
                // 剪切板操作类型
                clipboardType: ''
            };
        },

        // @override
        componentDidMount: function () {
            var me = this;
            io.md(me.state.path).then(function () {
                me.getDirectory();
            }, missionFailed);
        },

        onCancelBtnClick() {
            this.props.onClose({root: this.state.root});
            this.props.close();
        },

        onEnterBtnClick() {
            let me = this;
            if (me.props.mode === 'create') {
                io.open(me.state.selected).then(function () {
                    dialog.confirm({
                        title: 'Warning',
                        labels: {
                            enter: 'Enter',
                            cancel: 'Cancel'
                        },
                        appSkin: 'oneux3',
                        message: 'There a file with the same name.<br/>Override it or not?',
                        onEnter: () => dispatch()
                    });
                }, createFile);
            }
            else {
                dispatch();
            }
            function createFile() {
                io.create(me.state.selected).then(dispatch, missionFailed);
            }
            function dispatch() {
                me.props.onChange({
                    selected: me.state.selected,
                    root: me.state.root
                });
                me.props.close();
            }
        },

        onCreateBtnClick: function () {
            var me = this;
            dialog.pop({
                title: 'Create New Folder',
                content: NameCreator,
                contentProps: {
                    initialName: '',
                    group: me.state.directory,
                    onEnter: function (folder) {
                        io.md(me.state.path + '/' + folder).then(function () {
                            me.getDirectory();
                        }, missionFailed);
                    }
                }
            });
        },

        onUpBtnClick: function () {
            var arr = this.state.path.split('/');
            arr.pop();
            var path = arr.join('/');
            var root = path.replace(this.props.prefix + '/', '').replace(this.props.prefix, '');
            if (path.indexOf(this.props.prefix) < 0) {
                path = this.props.prefix + '/';
                root = '';
            }
            this.setState({
                path: path,
                root: root
            });
            this.getDirectory(path);
        },

        onPasteBtnClick: function () {
            var me = this;
            var {clipboard, clipboardType, path, directory} = me.state;
            var clipboardArr = clipboard.split('/');
            var name = clipboardArr.pop();
            if (clipboardArr.join('/') === path) return;
            var hasSameTarget = false;
            directory.map(function (entry) {
                hasSameTarget = entry.name === name || hasSameTarget;
            });
            if (hasSameTarget) {
                dialog.confirm({
                    title: 'Warning',
                    labels: {
                        enter: 'Enter',
                        cancel: 'Cancel'
                    },
                    appSkin: 'oneux3',
                    message: 'There a '
                        + (me.state.clipboardIsDirectory ? 'directory' : 'file')
                        + ' with the same name.<br/>'
                        + 'Override it or not?',
                    onEnter: () => action()
                });
            }
            else {
                action();
            }
            function action() {
                io[clipboardType === 'copy' ? 'copy' : 'move'](clipboard, path).then(function (res) {
                    me.getDirectory();
                    me.setState({clipboard: clipboardType === 'copy' ? clipboard : ''});
                }, missionFailed);
            }
        },

        onTableAction: function (type, item) {
            var me = this;
            if (type === 'select') {
                var changeSet = {
                    path: item.isDirectory ? item.fullPath : me.state.path,
                    root: item.isDirectory ? item.fullPath.replace(me.props.prefix + '/', '') : me.state.root
                };
                if (me.props.mode === 'dir' && item.isDirectory) {
                    changeSet.selected = item.fullPath;
                }
                else if ((me.props.mode === 'file' || me.props.mode === 'create') && !item.isDirectory) {
                    changeSet.selected = item.fullPath;
                }
                me.setState(changeSet);
                item.isDirectory && me.getDirectory(item.fullPath);
            }
            if (type === 'cut') {
                me.setState({
                    clipboard: item.fullPath,
                    clipboardIsDirectory: item.isDirectory,
                    clipboardType: 'cut'
                });
            }
            if (type === 'copy') {
                me.setState({
                    clipboard: item.fullPath,
                    clipboardIsDirectory: item.isDirectory,
                    clipboardType: 'copy'
                });
            }
            if (type === 'rename') {
                dialog.pop({
                    title: 'Rename ' + (item.isDirectory ? 'Folder' : 'File'),
                    content: NameCreator,
                    contentProps: {
                        initialName: item.name,
                        group: me.state.directory,
                        onEnter: function (newName) {
                            io.ren(item.fullPath, newName).then(fresh, missionFailed);
                        }
                    }
                });
            }
            if (type === 'delete') {
                dialog.confirm({
                    title: 'Please Confirm',
                    message: 'Are you sure to delete ' + item.name + '?',
                    labels: {
                        enter: 'Enter',
                        cancel: 'Cancel'
                    },
                    appSkin: 'oneux3',
                    onEnter: function () {
                        io[item.isDirectory ? 'deltree' : 'del'](item.fullPath).then(fresh, missionFailed);
                    }
                });
            }
            function fresh() {
                me.setState({
                    selected: me.state.selected === item.fullPath ? '' : me.state.selected,
                    clipboard: me.state.clipboard === item.fullPath ? '' : me.state.clipboard
                });
                me.getDirectory();
            }
        },

        onRootChange: function (e) {
            this.setState({root: e.target.value});
            this.getDirectory(this.props.prefix + '/' + e.target.value);
        },

        onSelectedBoxChange(e) {
            let value = e.target.value.replace(/\//g, '');
            value = this.state.path + '/' + value;
            value = value.replace(/\/\//g, '/');
            this.setState({selected: value});
        },

        getDirectory: function (path) {
            var me = this;
            path = path || this.state.path;
            io.dir(path).then(function (arr) {
                me.setState({
                    path: path,
                    directory: arr
                }, locateCursor);
            }, new Function());
            function locateCursor() {
                uiUtil.setCursorPosition(me.refs.path.refs.inputbox, path.length);
            }
        },

        render: function () {
            var rootProps = {
                ref: 'path',
                width: 475,
                value: this.state.root,
                onChange: this.onRootChange
            };
            var listProps = {
                datasource: this.state.directory,
                fieldConfig: tableFieldConfig,
                noDataRenderer: NoData,
                clipboard: this.state.clipboard,
                onAction: this.onTableAction,
                flags: {
                    showHeader: true
                }
            };
            let pasteBtnProps = {
                className: 'tc-icon icon-paste',
                onClick: this.state.clipboard ? this.onPasteBtnClick : undefined,
                style: !this.state.clipboard ? {color: 'grey'} : {}
            };
            let selectedBoxProps = {
                width: 450,
                disabled: this.props.mode !== 'create',
                value: this.state.selected.split('/').pop(),
                onChange: this.props.mode === 'create' ? this.onSelectedBoxChange : undefined
            };
            let cancelBtnProps = {
                width: 60,
                skin: 'black2',
                label: 'Cancel',
                onClick: this.onCancelBtnClick
            };
            let enterBtnProps = {
                skin: 'black',
                width: 60,
                label: this.props.mode !== 'create' ? 'Select' : 'OK',
                disabled: !this.state.selected.length,
                onClick: this.onEnterBtnClick
            };
            return (
                <div className="tc-explorer in-layer">
                    <span className="tc-icon icon-create-folder" onClick={this.onCreateBtnClick}></span>
                    <span className="tc-icon icon-up-level" onClick={this.onUpBtnClick}></span>
                    <span {...pasteBtnProps}></span>
                    <div className="dir-bar">
                        <span>/</span><TextBox {...rootProps}/>
                    </div>
                    <Table {...listProps}/>
                    <div className="foot-bar">
                        <TextBox {...selectedBoxProps}/>
                        <Button {...enterBtnProps}/>
                        <Button {...cancelBtnProps}/>
                    </div>
                </div>
            );
        }
    });


});
