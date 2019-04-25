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

export const dark: IModelBuilderTheme = {
    componentHostContainer: {
        background: '#1E1E1E'
    },
    containerHost: {
        borderColor: '#333333',
        activeBorderColor: '#084771'
    },
    containerWrap: {
        scrollbarTrackColor: '#333333',
        scrollbarThumbColor: '#084771'
    },
    badge: {
        background: '#084771',
        textColor: '#fff'
    },
    defaultComponent: {
        borderColor: '#333333',
        textColor: '#DBDBDB'
    },
    typography
};
