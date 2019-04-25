import { IModel } from '@start-app/form-builder-model';
import { ContainerComponentDescriptor } from '../components/container/container-descriptor';
import { ComponentRegistry } from './component-registry';
import { ControllerBuilder } from './controller-builder';
import { ComponentWithChildComponents, ComponentWithTwoContainers, TabControlComponent } from './controller-builder.data.spec';
import { ComponentState, IViewModel } from './interfaces';

describe('form builder controller tests', () => {

    const componentRegistry = new ComponentRegistry();
    let controller: ControllerBuilder;

    beforeEach(() => {
        controller = new ControllerBuilder(componentRegistry, 'md');

        componentRegistry.register(new ContainerComponentDescriptor());
        componentRegistry.register(new ComponentWithTwoContainers());
        componentRegistry.register(new ComponentWithChildComponents());
        componentRegistry.register(new TabControlComponent());
    });

    describe('view model tetsts', () => {

        describe('empty model', () => {
            it('undefined model should generate undefined viewModel', () => {
                controller.model = undefined;
                expect(controller.viewModel).toBeUndefined();
            });
        });

        describe('create empty root container', () => {
            let model: IModel;
            beforeEach(() => {
                model = {
                    name: 'container',
                    md: {
                        components: []
                    }
                };
            });

            it('references to the view model and the model should be different', () => {
                controller.model = model;
                expect(controller.viewModel as any).not.toBe(model);
            });

            it('root container should has the "container" name', () => {
                controller.model = model;
                expect(controller.viewModel.name).toBe('container');
            });

            it('root container should has empty components', () => {
                controller.model = model;
                expect(controller.viewModel.md.components).toBeDefined();
                expect(controller.viewModel.md.components.length).toBe(0);
            });
        });

        describe('create child containers', () => {
            let model: IModel;
            beforeEach(() => {
                model = {
                    name: 'container',
                    md: {
                        components: [
                            {
                                name: 'container',
                                md: {
                                    components: []
                                }
                            },
                            {
                                name: 'container',
                                md: {
                                    components: []
                                }
                            }
                        ]
                    }
                };
            });

            it('length of viewModel.components should be length of model.components', () => {
                controller.model = model;

                const viewModel = controller.viewModel;
                expect(viewModel.md.components.length).toBe(model.md.components.length);
            });

            it(`second child component's name should be "container"`, () => {
                controller.model = model;

                const viewModel = controller.viewModel;
                const secondChild = viewModel.md.components[1];
                expect(secondChild.name).toBe('container');
            });
        });

        describe('create child components', () => {
            let model: IModel;
            let viewModel: IViewModel;

            beforeEach(() => {
                model = {
                    name: 'childComponents',
                    md: {
                        child1: {
                            name: 'container',
                            md: {
                                components: []
                            }
                        },
                        child2: {
                            name: 'container',
                            md: {
                                components: []
                            }
                        }
                    }
                };

                controller.model = model;
                viewModel = controller.viewModel;
            });

            it('should correct child view model', () => {
                expect(viewModel.md.child1.id).toBeDefined();
            });
        });

        describe('create chldren components', () => {
            let model: IModel;
            let viewModel: IViewModel;

            beforeEach(() => {
                model = {
                    name: 'tab-control',
                    md: {
                        tabs: [
                            {
                                name: 'tab1',
                                container: {
                                    name: 'container',
                                    md: {
                                        components: []
                                    }
                                }
                            },
                            {
                                name: 'tab2',
                                container: {
                                    name: 'container',
                                    md: {
                                        components: []
                                    }
                                }
                            }
                        ]
                    }
                };

                controller.model = model;
                viewModel = controller.viewModel;
            });

            it('should contains container property', () => {
                const container: IViewModel = viewModel.md.tabs[0].container;

                expect(container.id).toBeDefined();
            });
        });

        describe(`multiple component's containers`, () => {
            let model: IModel;
            let viewModel: IViewModel;
            beforeEach(() => {
                model = {
                    name: 'twoContainersComponent',
                    md: {
                        container1: [],
                        container2: []
                    }
                };
                controller.model = model;
                viewModel = controller.viewModel;
            });

            it('component should contains container1', () => {
                expect(viewModel.md.container1).toBeDefined();
            });

            it('component should contains container2', () => {
                expect(viewModel.md.container2).toBeDefined();
            });

            it('component should not contains container3', () => {
                expect(viewModel.md.container3).not.toBeDefined();
            });
        });

        describe('select tests', () => {
            let model: IModel;
            beforeEach(() => {
                model = {
                    name: 'container',
                    md: {
                        components: [
                            {
                                name: 'container',
                                md: {
                                    components: []
                                }
                            },
                            {
                                name: 'container',
                                md: {
                                    components: []
                                }
                            },
                            {
                                name: 'container',
                                md: {
                                    components: []
                                }
                            }
                        ]
                    }
                };
                controller.model = model;
            });

            it('should be select one element', () => {
                const selectedComponent = controller.viewModel.md.components[1];
                controller.dispatch('select', selectedComponent);

                expect(controller.viewModel.md.components[1].state).toBe(ComponentState.Selected);
            });

            it('should be deselect during double select', () => {
                const selectedComponent = controller.viewModel.md.components[1];
                controller.dispatch('select', selectedComponent);
                controller.dispatch('select', selectedComponent);

                expect(controller.viewModel.md.components[1].state).toBe(ComponentState.None);
            });

            it('should be select first and last element', () => {
                const selectedComponents = [
                    controller.viewModel.md.components[0],
                    controller.viewModel.md.components[2]
                ];
                controller.dispatch('select', selectedComponents);

                expect(controller.viewModel.md.components[0].state).toBe(ComponentState.Selected);
                expect(controller.viewModel.md.components[2].state).toBe(ComponentState.Selected);
            });

            it('should not be select', () => {
                const selectedComponents = [
                    controller.viewModel.md.components[0],
                    controller.viewModel.md.components[2]
                ];
                controller.dispatch('select', selectedComponents);

                expect(controller.viewModel.md.components[1].state).toBe(ComponentState.None);
            });

            it('should be deselect', () => {
                const selectedComponent = controller.viewModel.md.components[1];
                controller.dispatch('select', selectedComponent);
                controller.dispatch('deselect', selectedComponent);

                expect(controller.viewModel.md.components[1].state).toBe(ComponentState.None);
            });

            it(`should deselect all selected items`, () => {
                const selectedComponents = [
                    controller.viewModel.md.components[0],
                    controller.viewModel.md.components[2]
                ];
                controller.dispatch('select', selectedComponents);
                controller.dispatch('cancelSelection');

                expect(controller.viewModel.md.components[0].state).toBe(ComponentState.None);
                expect(controller.viewModel.md.components[2].state).toBe(ComponentState.None);
            });
        });

        describe('insert tests', () => {
            let model: IModel;
            beforeEach(() => {
                model = {
                    name: 'container',
                    md: {
                        components: [
                            {
                                name: 'container',
                                md: {
                                    components: []
                                }
                            }
                        ]
                    }
                };
                controller.model = model;
            });

            it('should be insert', () => {
                const parent = controller.viewModel.md.components[0];
                const item: IModel = {
                    name: 'container',
                    md: {
                        components: [{
                            name: 'container',
                            md: {
                                components: []
                            }
                        }]
                    }
                };

                controller.dispatch('insert', { item, parent });

                expect(controller.model.md.components.length).toBe(1);
            });
        });

        describe('remove after insert test', () => {
            let model: IModel;
            let viewModel: IViewModel;
            beforeEach(() => {
                model = {
                    name: 'container',
                    md: {
                        components: [{
                                name: 'container',
                                md: {
                                    components: [{
                                        name: 'container',
                                        md: {
                                            components: []
                                        }
                                    }]
                                }
                            }
                        ]
                    }
                };
                controller.model = model;
                viewModel = controller.viewModel;
            });

            it('should remove inserted component', () => {
                const item: IModel = {
                    name: 'container',
                    md: {
                        components: []
                    }
                };

                const parent = controller.viewModel;

                controller.dispatch('insert', { item, parent });
                const insertedViewModel = controller.viewModel.md.components[1];
                controller.dispatch('select', insertedViewModel);
                controller.dispatch('delete', insertedViewModel);

                expect(controller.viewModel.md.components.length).toBe(1);
            });
        });

        describe('cut tests', () => {
            let model: IModel;
            beforeEach(() => {
                model = {
                    name: 'container',
                    md: {
                        components: [{
                                name: 'container',
                                md: {
                                    components: [{
                                        name: 'container',
                                        md: {
                                            components: []
                                        }
                                    }]
                                }
                            },
                            {
                                name: 'container',
                                md: {
                                    components: []
                                }
                            }
                        ]
                    }
                };
                controller.model = model;
            });

            it('should be move', () => {
                controller.dispatch('select',  controller.viewModel.md.components[0].md.components[0]);
                controller.dispatch('cut');

                controller.dispatch('select', controller.viewModel.md.components[1]);
                controller.dispatch('paste');

                expect(controller.viewModel.md.components[1].md.components.length).toBe(1);
                expect(controller.viewModel.md.components[0].md.components.length).toBe(0);
            });
        });

        describe('copy tests', () => {
            let model: IModel;
            beforeEach(() => {
                model = {
                    name: 'container',
                    md: {
                        components: [{
                                name: 'container',
                                md: {
                                    components: [{
                                        name: 'container',
                                        md: {
                                            components: []
                                        }
                                    }]
                                }
                            },
                            {
                                name: 'container',
                                md: {
                                    components: []
                                }
                            }
                        ]
                    }
                };
                controller.model = model;
            });

            it('should be copy', () => {

                controller.dispatch('select', controller.viewModel.md.components[0].md.components[0]);
                controller.dispatch('copy');

                controller.dispatch('select', controller.viewModel.md.components[1]);
                controller.dispatch('paste');

                expect(controller.viewModel.md.components[1].md.components.length).toBe(1);
                expect(controller.viewModel.md.components[0].md.components.length).toBe(1);
            });
        });
    });

    describe('copy and cut tests', () => {
        let model: IModel;
        beforeEach(() => {
            model = {
                name: 'container',
                md: {
                    components: [{
                        name: 'container',
                        md: {
                            components: [{
                                name: 'container',
                                md: {
                                    components: []
                                }
                            }]
                        }
                    }, {
                        name: 'container',
                        md: {
                            components: []
                        }
                    },  {
                        name: 'container',
                        md: {
                            components: []
                        }
                    }]
                }
            };
            controller.model = model;
        });

        it('cut after copy and paste', () => {
            controller.dispatch('select', controller.viewModel.md.components[1]);
            controller.dispatch('copy');

            controller.dispatch('select', controller.viewModel.md.components[2]);
            controller.dispatch('paste');

            expect(controller.viewModel.md.components[1].md.components.length).toBe(0);
            expect(controller.viewModel.md.components[0].md.components.length).toBe(1);
            expect(controller.viewModel.md.components[2].md.components[0].md.components.length).toBe(0);

            controller.dispatch('cancelSelection');
            controller.dispatch('select', controller.viewModel.md.components[0].md.components[0]);
            controller.dispatch('cut');

            controller.dispatch('select', controller.viewModel.md.components[1]);
            controller.dispatch('paste');

            expect(controller.viewModel.md.components[1].md.components.length).toBe(1);
            expect(controller.viewModel.md.components[2].md.components[0].md.components.length).toBe(0);
            expect(controller.viewModel.md.components[0].md.components.length).toBe(0);
        });
    });
});
