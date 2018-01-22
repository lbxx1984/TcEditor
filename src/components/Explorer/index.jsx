/**
 * @file 浏览器文件沙箱
 * @author Brian Li
 * @email lbxxlht@163.com
 */
/* eslint-disable react/no-string-refs */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'fcui2/Dialog.jsx';
import Toast from 'fcui2/Toast.jsx';
import TextBox from 'fcui2/TextBox.jsx';
import Table from 'fcui2/Table.jsx';
import Button from 'fcui2/Button.jsx';
import util from 'fcui2/core/util';
import NameCreator from '../NameCreator';
import NoData from './renderer/TableNoDataRenderer';
import tableFieldConfig from './tableFieldConfig';
import io from '../../core/io';


const dialog = new Dialog();

function missionFailed() {
    Toast.pop({
        type: 'error',
        message: 'Mission failed.'
    });
}

function getFullPath(me) {
    let path = me.state.selected;
    if (me.props.extension.length && path.split('.').pop() !== me.props.extension) {
        path += '.' + me.props.extension;
    }
    return path;
}


export default class Explorer extends Component {

    static defaultProps = {
        // 目录前缀
        prefix: '',
        // 当前所处目录
        root: '',
        // 工作模式
        //      dir，选择目录
        //      file，选择文件，不可创建新文件，即输入框无法编辑
        //      create，创建一个新文件或者选中一个已有文件将其覆盖
        mode: 'dir',
        extension: 'tcm',
        onChange: new Function(),
        onClose: new Function()
    }

    static propTypes = {
        prefix: PropTypes.string,
        root: PropTypes.string,
        mode: PropTypes.string,
        onClose: PropTypes.func,
        onChange: PropTypes.func,
        close: PropTypes.func.isRequired
    }

    constructor(args) {
        super(args);
        this.onCancelBtnClick = this.onCancelBtnClick.bind(this);
        this.onEnterBtnClick = this.onEnterBtnClick.bind(this);
        this.onCreateBtnClick = this.onCreateBtnClick.bind(this);
        this.onUpBtnClick = this.onUpBtnClick.bind(this);
        this.onPasteBtnClick = this.onPasteBtnClick.bind(this);
        this.onTableAction = this.onTableAction.bind(this);
        this.onRootChange = this.onRootChange.bind(this);
        this.onSelectedBoxChange = this.onSelectedBoxChange.bind(this);
        this.state = {
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
    }

    componentDidMount() {
        io.md(this.state.path).then(() => {
            this.getDirectory();
        }, missionFailed);
    }

    onCancelBtnClick() {
        this.props.onClose({root: this.state.root});
        this.props.close();
    }

    onEnterBtnClick() {
        const path = getFullPath(this);
        const dispatch = () => {
            this.props.onChange({
                selected: path,
                root: this.state.root
            });
            this.props.close();
        };
        if (this.props.mode === 'create') {
            io.open(path).then(() => {
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
            }, () => {
                io.create(path).then(dispatch, missionFailed);
            });
        }
        else {
            dispatch();
        }
    }

    onCreateBtnClick() {
        dialog.pop({
            title: 'Create New Folder',
            content: NameCreator,
            contentProps: {
                initialName: '',
                group: this.state.directory,
                onEnter: folder => {
                    io.md(this.state.path + '/' + folder).then(() => {
                        this.getDirectory();
                    }, missionFailed);
                }
            }
        });
    }

    onUpBtnClick() {
        const arr = this.state.path.split('/');
        arr.pop();
        let path = arr.join('/');
        let root = path.replace(this.props.prefix + '/', '').replace(this.props.prefix, '');
        if (path.indexOf(this.props.prefix) < 0) {
            path = this.props.prefix + '/';
            root = '';
        }
        this.setState({path, root});
        this.getDirectory(path);
    }

    onPasteBtnClick() {
        const {clipboard, clipboardType, path, directory} = this.state;
        const clipboardArr = clipboard.split('/');
        if (clipboardArr.join('/') === path) return;
        const name = clipboardArr.pop();
        const hasSameTarget = directory.filter(entry => entry.name === name).length;
        const action = () => {
            io[clipboardType === 'copy' ? 'copy' : 'move'](clipboard, path).then(() => {
                this.getDirectory();
                this.setState({clipboard: clipboardType === 'copy' ? clipboard : ''});
            }, missionFailed);
        };
        if (hasSameTarget) {
            dialog.confirm({
                title: 'Warning',
                labels: {
                    enter: 'Enter',
                    cancel: 'Cancel'
                },
                appSkin: 'oneux3',
                message: 'There a '
                    + (this.state.clipboardIsDirectory ? 'directory' : 'file')
                    + ' with the same name.<br/>'
                    + 'Override it or not?',
                onEnter: () => action()
            });
        }
        else {
            action();
        }
    }

    onTableAction(type, item) {
        const fresh = () => {
            this.setState({
                selected: this.state.selected === item.fullPath ? '' : this.state.selected,
                clipboard: this.state.clipboard === item.fullPath ? '' : this.state.clipboard
            });
            this.getDirectory();
        };
        if (type === 'select') {
            const changeSet = {
                path: item.isDirectory ? item.fullPath : this.state.path,
                root: item.isDirectory ? item.fullPath.replace(this.props.prefix + '/', '') : this.state.root
            };
            if (this.props.mode === 'dir' && item.isDirectory) {
                changeSet.selected = item.fullPath;
            }
            else if ((this.props.mode === 'file' || this.props.mode === 'create') && !item.isDirectory) {
                changeSet.selected = item.fullPath;
                if (changeSet.selected === this.state.selected) { // 文件连击
                    this.onEnterBtnClick();
                    return;
                }
            }
            this.setState(changeSet);
            item.isDirectory && this.getDirectory(item.fullPath);
            return;
        }
        if (type === 'cut') {
            this.setState({
                clipboard: item.fullPath,
                clipboardIsDirectory: item.isDirectory,
                clipboardType: 'cut'
            });
            return;
        }
        if (type === 'copy') {
            this.setState({
                clipboard: item.fullPath,
                clipboardIsDirectory: item.isDirectory,
                clipboardType: 'copy'
            });
            return;
        }
        if (type === 'rename') {
            dialog.pop({
                title: 'Rename ' + (item.isDirectory ? 'Folder' : 'File'),
                content: NameCreator,
                contentProps: {
                    initialName: item.name,
                    group: me.state.directory,
                    onEnter: newName => {
                        io.ren(item.fullPath, newName).then(fresh, missionFailed);
                    }
                }
            });
            return;
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
                onEnter: () => {
                    io[item.isDirectory ? 'deltree' : 'del'](item.fullPath).then(fresh, missionFailed);
                }
            });
        }
    }

    onRootChange(e) {
        this.setState({root: e.target.value});
        this.getDirectory(this.props.prefix + '/' + e.target.value);
    }

    onSelectedBoxChange(e) {
        let value = e.target.value.replace(/\//g, '');
        value = this.state.path + '/' + value;
        value = value.replace(/\/\//g, '/');
        this.setState({selected: value});
    }

    getDirectory(path) {
        path = path || this.state.path;
        io.dir(path).then(directory => {
            this.setState({path, directory}, () => {
                util.setCursorPosition(this.refs.path.refs.inputbox, path.length)
            });
        }, missionFailed);
    }

    render() {
        const rootProps = {
            ref: 'path',
            width: 475,
            value: this.state.root,
            onChange: this.onRootChange
        };
        const listProps = {
            datasource: this.state.directory,
            fieldConfig: tableFieldConfig,
            noDataRenderer: NoData,
            clipboard: this.state.clipboard,
            onAction: this.onTableAction,
            flags: {
                showHeader: true
            }
        };
        const pasteBtnProps = {
            className: 'tc-icon tc-icon-paste',
            onClick: this.state.clipboard ? this.onPasteBtnClick : undefined,
            style: !this.state.clipboard ? {color: 'grey'} : {}
        };
        const selectedBoxProps = {
            width: 450,
            disabled: this.props.mode !== 'create',
            value: this.state.selected.split('/').pop(),
            onChange: this.props.mode === 'create' ? this.onSelectedBoxChange : undefined
        };
        const cancelBtnProps = {
            width: 60,
            skin: 'black2',
            label: 'Cancel',
            onClick: this.onCancelBtnClick
        };
        const enterBtnProps = {
            skin: 'black',
            width: 60,
            label: this.props.mode !== 'create' ? 'Select' : 'OK',
            disabled: !this.state.selected.length,
            onClick: this.onEnterBtnClick
        };
        return (
            <div className="tc-explorer in-layer">
                <span className="tc-icon tc-icon-create-folder" onClick={this.onCreateBtnClick}></span>
                <span className="tc-icon tc-icon-up-level" onClick={this.onUpBtnClick}></span>
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
}
