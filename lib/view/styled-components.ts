import * as styledComponents from 'styled-components';
import { IModelBuilderTheme } from './interfaces';

const {
    default: styled,
    css,
    createGlobalStyle,
    keyframes,
    ThemeProvider
} = styledComponents as styledComponents.ThemedStyledComponentsModule<IModelBuilderTheme>;

export { css, createGlobalStyle, keyframes, ThemeProvider };
export default styled;
