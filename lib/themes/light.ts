import { IModelBuilderTheme } from '../view/interfaces';

const typography = {
    sizes: {
        text: '0.8125rem',
        badge: '0.6875rem'
    },
    font: '"Roboto", sans-serif',
    weights: {
        bold: '700'
    }
};

export const light: IModelBuilderTheme = {
    componentHostContainer: {
        background: '#fff'
    },
    containerHost: {
        borderColor: '#8c8b8c',
        activeBorderColor: '#26b4e3'
    },
    containerWrap: {
        scrollbarTrackColor: '#efefef',
        scrollbarThumbColor: '#d5d7da'
    },
    badge: {
        background: '#d2eff9',
        textColor: '#2e90ea'
    },
    defaultComponent: {
        borderColor: '#d5d7da',
        textColor: '#414141'
    },
    typography
};
