import * as React from 'react';
import styled from 'styled-components';
import { IViewModel } from '../controller/interfaces';
import { BaseFormBuilderDescriptor } from './base-form-builder-descriptor';
import { FormBuilderComponent } from './form-builder-component';

const DefaultComponent = styled.div`
    border: 1px solid ${(props) => props.theme.defaultComponent.borderColor};
    color: ${(props) => props.theme.defaultComponent.textColor};
    padding: 10px;
    overflow-x: auto;
    
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

export class DefaultComponentDescriptor extends BaseFormBuilderDescriptor {

    constructor(public name: string) {
        super();
    }

    public render(model: IViewModel): React.ReactElement<FormBuilderComponent> {
        return <DefaultComponent>{model.name}</DefaultComponent>;
    }
}
