import * as React from 'react';
import { IViewModel } from '../controller/interfaces';
import { BaseFormBuilderDescriptor } from './base-form-builder-descriptor';
import { FormBuilderComponent } from './form-builder-component';
export declare class DefaultComponentDescriptor extends BaseFormBuilderDescriptor {
    name: string;
    constructor(name: string);
    render(model: IViewModel): React.ReactElement<FormBuilderComponent>;
}
