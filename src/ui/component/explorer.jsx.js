define(function (require) {    

    return React.createClass({
        getInitialState: function () {
            return {files: []}
        },
        componentDidMount: function () {
            var me = this;
            this.props.fs.dir(gotFiles);
            function gotFiles(result) {
                var infos = [];
                readMeta(0);
                function readMeta(i) {
                    if (i === result.length) {
                        me.setState({files: infos});
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
        },
        render: function () {
            function mapFiles(item) {
                console.log(item);
                return item;
            }
            return (
                <div className="explorer">
                    {this.state.files.map(mapFiles)}
                </div>
            );
        }
    });
});
