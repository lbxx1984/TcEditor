/**
 * @file 物体编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var _ = require('underscore');



    return React.createClass({
        // @override
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        onPanelCloseIconClick: function () {
            this.context.dispatch('view-close-panel', this.props.type);
        },
        onPanelToggleIconClick: function () {
            this.context.dispatch('view-toggle-panel', this.props.type);
        },
        render: function () {
            var expendBtnIcon = this.props.expend ? 'icon-xiashixinjiantou' : 'icon-youshixinjiantou';
            return (
                <div className="tc-meshlist">
                    <div className="tc-panel-title-bar">
                        <span className="iconfont icon-guanbi1" onClick={this.onPanelCloseIconClick}></span>
                        <span className={'iconfont ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
                        Geometry Properties
                    </div>
                    <div className="tc-panel-content-container">
                        
                    </div>
                </div>
            );
        }
    });


});
