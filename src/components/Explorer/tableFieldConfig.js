/**
 * @file 浏览器文件沙箱
 * @author Brian Li
 * @email lbxxlht@163.com
 */

import FileName from './renderer/FileName';
import FileMeta from './renderer/FileMeta';
import FileOperation from './renderer/FileOperation';

export default [
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
