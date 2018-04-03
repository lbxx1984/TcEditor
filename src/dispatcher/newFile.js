/**
 * @file 新建文件
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import config, {EMPTY_EDITOR_DATASET} from '../config';

export default function() {
    this.fill({
        ...config,
        ...EMPTY_EDITOR_DATASET
    });
    document.title = config.editorTitle;
}
