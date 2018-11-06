import React from 'react';
import ReactDOM from 'react-dom';
import TitleWindow from './TitleWindow';


export function pop(param) {
    const tempContainer = document.createElement('div');
    const {content: Content, contentProps: cProps} = param;
    const close = () => {
        ReactDOM.unmountComponentAtNode(tempContainer);
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
    ReactDOM.render(<TitleWindow {...windowProps}>
        <Content {...contentProps}/>
    </TitleWindow>, tempContainer);
}


export default {
    pop
}