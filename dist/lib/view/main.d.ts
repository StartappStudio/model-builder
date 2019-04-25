import * as React from 'react';
import { FormBuilderContext } from '../context';
import { IViewModel } from '../controller/interfaces';
export default class Main extends React.Component<IViewModel, {}> {
    static contextType: React.Context<import("../context").IFormBuilderContext>;
    context: React.ContextType<typeof FormBuilderContext>;
    render(): JSX.Element;
    private keyDown;
}
