/**
 * @file 浏览器文件沙箱
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var TextBox = require('fcui2/TextBox.jsx');
    var Table = require('fcui2/Table.jsx');
    var FileName = require('../renderer/FileName.jsx');
    var FileMeta = require('../renderer/FileMeta.jsx');
    var NoData = require('../renderer/TableNoDataRenderer.jsx');

    var _ = require('underscore');
    var io = require('../../core/io');


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
            width: 100,
            renderer: FileMeta
        },
        {
            label: 'time',
            field: 'mtime',
            width: 140,
            renderer: FileMeta
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
            var path = this.props.prefix + '/' + this.state.root;
            io.createLocalDirectory(path).then(function () {
                return io.getLocalDirectory(path)
            }).then(function (arr) {
                me.setState({directory: arr});
            });
        },
        onRootChange: function (e) {
            this.setState({root: e.target.value});
            var path = this.props.prefix + '/' + e.target.value;
            var me = this;
            io.getLocalDirectory(path).then(function (arr) {
                console.log(arr);
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
