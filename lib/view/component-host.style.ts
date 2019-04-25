import { ComponentState, IComponentProperties, IViewModel } from '../controller/interfaces';
import styled, { css, keyframes } from './styled-components';

const ticker = keyframes`
    0% {
        background-position: left top, right bottom, left bottom, right top;
    }
    100% {
        background-position: left 15px top, right 15px bottom, left bottom 15px, right top 15px;
    }
`;

const cut = css`
    width: auto;
    background-image:
        linear-gradient(90deg, ${(props) => props.theme.containerHost.activeBorderColor} 50%, transparent 50%),
        linear-gradient(90deg, ${(props) => props.theme.containerHost.activeBorderColor} 50%, transparent 50%),
        linear-gradient(0deg, ${(props) => props.theme.containerHost.activeBorderColor} 50%, transparent 50%),
        linear-gradient(0deg, ${(props) => props.theme.containerHost.activeBorderColor} 50%, transparent 50%);
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size: 5px 1px, 5px 1px, 1px 5px, 1px 5px;
    background-position: left top, right bottom, left bottom, right top;
    animation: ${ticker} 1s infinite linear;
    border: 1px;
`;

export const ComponentHostContainer = styled.div`
    background: ${(props) => props.theme.componentHostContainer.background};
`;

export const ContainerHost = styled.div<{ state: IViewModel }>`
    font-family: ${(props) => props.theme.typography.font};
    font-size: ${(props) => props.theme.typography.sizes.text};
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    border-width: 1px;
    border-style: dashed;
    border-color: ${(props) => {
            if (props.state.state === ComponentState.Selected) {
                return props.theme.containerHost.activeBorderColor;
            } else if (props.state.name !== 'container') {
                return props.theme.componentHostContainer.background;
            } else {
                return props.theme.containerHost.borderColor;
            }
        }
    };

    ${(props) => props.state.state === ComponentState.Cut ? cut : ''}
    
    &.active-container {
        border-color: ${(props) => props.theme.containerHost.activeBorderColor};
    }
    & > .active-badge {
        display: block;
    }
`;

const badge = styled.div`
    padding: 3px 5px;
    position: absolute;
    top: -1px;
    left: -1px;
    background-color: ${(props) => props.theme.badge.background};
    transform: translateY(-100%);
    border: 1px dashed ${(props) => props.theme.badge.background};
    font-size: ${(props) => props.theme.typography.sizes.badge};
    color: ${(props) => props.theme.badge.textColor};
    line-height: 1;
    z-index: 10000;
    pointer-events: none;
`;

export const ContainerBadge = styled(badge)<{ show: boolean }>`
    display: ${(props) => props.show ? 'block' : 'none' };
`;

const container = styled.div<{ md: IComponentProperties}>`
    display: flex;
`;

const flexStyle = {
    around: 'space-around',
    between: 'space-between',
    center: 'center',
    end: 'flex-end',
    start: 'flex-start'
};

export const ContainerWrap = styled(container)`
    height: 100%;
    width: 100%;
    overflow-x: auto;
    padding: 20px 9px;
    box-sizing: border-box;
    flex-wrap: ${(props) => props.md.wrap ? 'wrap' : 'nowrap'};
    flex-direction: ${(props) => {
            if (props.md.direction === 'horizontal') {
                return !props.md.reverse ? 'row' : 'row-reverse';
            } else {
                return !props.md.reverse ? 'column' : 'column-reverse';
            }
        }
    };
    align-items: ${(props) => {
            if (props.md.direction === 'horizontal') {
                return flexStyle[props.md.vertical];
            } else {
                return flexStyle[props.md.horizontal];
            }
        }
    };
    justify-content: ${(props) => {
            if (props.md.direction === 'horizontal') {
                if (props.md.space === 'none') {
                    return flexStyle[props.md.horizontal];
                } else {
                    return flexStyle[props.md.space];
                }
            } else {
                if (props.md.space === 'none') {
                    return flexStyle[props.md.vertical];
                } else {
                    return flexStyle[props.md.space];
                }
            }
        }
    };
    
    ::-webkit-scrollbar-button {
        background-repeat:no-repeat;
        width:5px;
        height:0px
    }
    ::-webkit-scrollbar-track {
      background-color: ${(props) => props.theme.containerWrap.scrollbarTrackColor};
    }
    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 0px;
        border-radius: 0px;
        background-color: ${(props) => props.theme.containerWrap.scrollbarThumbColor};
    }
    ::-webkit-resizer{
        background-repeat:no-repeat;
        width:4px;
        height:0px
    }
    ::-webkit-scrollbar{
        height: 7px;
    }
`;
