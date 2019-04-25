import * as React from 'react';
import { FormBuilderContext } from '../../context';
import { FormBuilderComponent } from '../form-builder-component';
export declare class Container extends FormBuilderComponent {
    static contextType: React.Context<import("../../context").IFormBuilderContext>;
    context: React.ContextType<typeof FormBuilderContext>;
    render(): JSX.Element;
}
