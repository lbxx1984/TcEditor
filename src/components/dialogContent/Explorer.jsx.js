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


    var FileName = require('../renderer/FileName.jsx');
    var FileMeta = require('../renderer/FileMeta.jsx');
    var FileOperation = require('../renderer/FileOperation.jsx');
    var NoData = require('../renderer/TableNoDataRenderer.jsx');
    var NameCreator = require('./NameCreator.jsx');


    var _ = require('underscore');
    var io = require('../../core/io');


    var dialog = new Dialog();
    var fieldConfig = [
        {
            label: 'name',
            field: 'name',
            width: 300,
            renderer: FileName
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
                prefix: '',
                root: ''
            };
        },
        // @override
        getInitialState: function () {
            return {
                // 当前绝对路径
                path: this.props.prefix + '/' + this.props.root,
                // 显示给用户却掉前缀的相对路径
                root: this.props.root,
                // 当前目录结构
                directory: []
            };
        },
        // @override
        componentDidMount: function () {
            var me = this;
            io.createLocalDirectory(me.state.path).then(function () {
                me.getDirectory();
            }, missionFailed);
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
                        io.createLocalDirectory(me.state.path + '/' + folder).then(function () {
                            me.getDirectory();
                        }, missionFailed);
                    }
                }
            });
        },

        onTableAction: function (type, item) {
            var me = this;
            if (type === 'delete') {
                dialog.confirm({
                    title: 'Please Confirm',
                    message: 'Are you sure to delete ' + item.name + '?',
                    onEnter: function () {
                        var func = item.isDirectory ? 'deleteLocalDirectory' : 'deleteLocalFile';
                        io[func](item.fullPath).then(function () {
                            me.getDirectory();
                        }, missionFailed);
                    }
                });
            }
        },

        onRootChange: function (e) {
            this.setState({root: e.target.value});
            this.getDirectory(this.props.prefix + '/' + e.target.value);
        },

        getDirectory: function (path) {
            var me = this;
            path = path || this.state.path;
            io.getLocalDirectory(path).then(function (arr) {
                me.setState({
                    path: path,
                    directory: arr
                });
            }, new Function());
        },

        render: function () {
            var rootProps = {
                width: 495,
                value: this.state.root,
                onChange: this.onRootChange
            };
            var listProps = {
                datasource: this.state.directory,
                fieldConfig: fieldConfig,
                noDataRenderer: NoData,
                onAction: this.onTableAction,
                flags: {
                    showHeader: true
                }
            };
            return (
                <div className="tc-explorer in-layer">
                    <span className="tc-icon icon-create-folder" onClick={this.onCreateBtnClick}></span>
                    <div className="dir-bar">
                        <span>/</span><TextBox {...rootProps}/>
                    </div>
                    <Table {...listProps}/>
                </div>
            );
        }
    });


});
