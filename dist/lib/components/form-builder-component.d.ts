import { IModel } from '@start-app/form-builder-model';
import * as React from 'react';
import { FormBuilderContext } from '../context';
import { IViewModel } from '../controller/interfaces';
export declare class FormBuilderComponent extends React.Component<IViewModel, any> {
    context: React.ContextType<typeof FormBuilderContext>;
    componentDidMount(): void;
    updateProperties: (model: IModel) => void;
}
