/**
 * @file io处理工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import FileSystem from 'file-system';

const fileCache = {};
const fs = new FileSystem();


// 从本地上传图片
export function uploadImage(inputFile) {
    return new Promise(function (resolve, reject) {
        const file = inputFile.files[0];
        if (file.type.indexOf('image/') !== 0) {
            reject();
            return;
        }
        const key = file.lastModified + '.' + file.size + '.' + file.name;
        const cache = fileCache[key];
        if (cache) {
            resolve(cache);
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.onload = function () {
                fileCache[key] = img;
                resolve(img);
            };
        };
        reader.onerror = function () {
            reject();
        };
        reader.readAsDataURL(file);
    });
}


// 将本地文件上传到内存
export function uploadFromBrowser(extension) {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.cssText = 'visibility:hidden;';
    document.body.appendChild(input);
    return new Promise(function (resolve, reject) {
        input.onchange = function (evt) {
            document.body.removeChild(input);
            const file = evt.target.files[0];
            if (extension && file.name.split('.').pop() !== extension) {
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                resolve(e);
            };
            reader.onerror = function () {
                reject();
            };
            reader.readAsArrayBuffer(file);
        };
        input.click();
    });
}


// 将打开文件内部图片放入内存
export function importImage(key, dataset) {
    return new Promise(function (resolve) {
        let image = null;
        Object.keys(fileCache).map(key => {
            if (fileCache[key].src === dataset) image = fileCache[key];
        });
        if (image) {
            resolve(image);
            return;
        }
        const img = document.createElement('img');
        img.src = dataset;
        fileCache[key] = img;
        resolve(img);
    });
}


fs.uploadImage = uploadImage;
fs.uploadFromBrowser = uploadFromBrowser;
fs.importImage = importImage;


export default fs;
