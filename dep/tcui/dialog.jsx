import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import TitleWindow from './TitleWindow';
import './css/dialog.less';


export function pop(param) {
    const tempContainer = document.createElement('div');
    const {content: Content, contentProps: cProps} = param;
    const close = () => {
        ReactDOM.unmountComponentAtNode(tempContainer);
        typeof param.onDialogClose === 'function' && param.onDialogClose();
    };
    const windowProps = {
        ...param,
        open: true,
        onClose: close
    };
    const contentProps = {
        ...cProps,
        close
    };
    ReactDOM.render(<TitleWindow {...windowProps}><Content {...contentProps}/></TitleWindow>, tempContainer);
    return tempContainer;
}


export function confirm(param) {
    let tempContainer = null;
    const {message = '', labels = {}} = param;
    const {enter = 'Enter', cancel = 'Cancel'} = labels;
    const close = () => {
        ReactDOM.unmountComponentAtNode(tempContainer);
    };
    const enterProps = {
        skin: 'black',
        label: enter,
        width: 60,
        onClick() {
            close();
            typeof param.onEnter === 'function' && param.onEnter();
        }
    };
    const cancelProps = {
        label: cancel,
        width: 60,
        onClick() {
            close();
            typeof param.onCancel === 'function' && param.onCancel();
        }
    };
    const content = typeof param.content === 'function' ? content : () => <div className="tcui-confirm">
        <div dangerouslySetInnerHTML={{__html: message}}></div> 
        <div>
            <Button {...enterProps}/>
            <Button {...cancelProps}/>
        </div>
    </div>;
    tempContainer = pop({...param, content, onDialogClose: () => {alert('123')}});
}


export default {
    pop,
    confirm
}