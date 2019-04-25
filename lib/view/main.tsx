import * as React from 'react';
import { FormBuilderContext } from '../context';
import { IViewModel } from '../controller/interfaces';

const rootStyle = {
    width: '100%',
    height: '100%',
    display: 'block',
    outline: 'none'
};

export default class Main extends React.Component<IViewModel, {}> {

    public static contextType = FormBuilderContext;
    public context!: React.ContextType<typeof FormBuilderContext>;

    public render() {
        return <div style={rootStyle} tabIndex={1} onKeyDown={(event) => this.keyDown(event)}>
            {this.context.registry.render(this.props, null)}
        </div>;
    }

    private keyDown(event: React.KeyboardEvent) {
        this.context.events.onKeyUp(event);
    }
}
