import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropDownList from './DropDownList';
import './css/Select.less';

export default class Select extends Component {

    static propTypes = {
        skin: PropTypes.string,
        value: PropTypes.number,
        datasource: PropTypes.array,
        onChange: PropTypes.func
    }

    static defaultProps = {
        skin: '',
        value: null,
        datasource: [],
        onChange: () => {}
    }

    constructor(args) {
        super(args);
    }

    render() {
        const {skin, onChange, value, datasource} = this.props;
        const selected = datasource.filter(i => i.value === value);
        const props = {
            ...this.props,
            skin: `select${skin ? `-${skin}` : ''}`,
            label: selected.length ? selected[0].label : ' ',
            onClick: e => typeof onChange === 'function' ? onChange(e) : null
        };
        return <DropDownList {...props}/>;
    }
}
