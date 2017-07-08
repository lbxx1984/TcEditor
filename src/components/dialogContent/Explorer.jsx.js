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
                root: this.props.root,
                directory: []
            };
        },
        // @override
        componentDidMount: function () {
            var me = this;
            io.createLocalDirectory(this.props.prefix + '/' + this.state.root).then(function () {
                me.getDirectory();
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
                        }, function () {
                            Toast.pop({
                                type: 'error',
                                message: 'Mission failed.'
                            });
                        });
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
            path = path || (this.props.prefix + '/' + this.state.root);
            io.getLocalDirectory(path).then(function (arr) {
                me.setState({directory: arr});
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
                    <div className="dir-bar">
                        <span>/</span><TextBox {...rootProps}/>
                    </div>
                    <Table {...listProps}/>
                </div>
            );
        }
    });


});
