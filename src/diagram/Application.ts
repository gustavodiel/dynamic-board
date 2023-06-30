import createEngine, {
    DefaultDiagramState, DeleteItemsAction,
    DiagramModel
} from '@projectstorm/react-diagrams';
import {InputNodeFactory} from "./input/InputNodeFactory";
import {InputNodeModel} from "./input/InputNodeModel";
import {ValueLinkFactory, ValuePortFactory} from "./components/ValueLinkModel";
import {BaseNodeFactory} from "./components/base/BaseNodeFactory";
import {DiagramEngine} from "@projectstorm/react-diagrams-core";
import {BaseNode} from "./components/base/BaseNode";
import {AdditionNodeFactory} from "./components/operations/AdditionNodeFactory";
import {MultiplicationNodeFactory} from "./components/operations/MultiplicationNodeFactory";
import {DivisionNodeFactory} from "./components/operations/DivisionNodeFactory";
import {SubtractionNodeFactory} from "./components/operations/SubtractionNodeFactory";

export class Application {
    protected activeModel: DiagramModel;
    protected diagramEngine: DiagramEngine;
    protected callback: any;
    protected listeners = []

    constructor() {
        this.diagramEngine = createEngine({ registerDefaultDeleteItemsAction: false });
        this.activeModel = new DiagramModel();

        this.newModel();

    }

    public newModel() {
        this.activeModel.setZoomLevel(130)

        const state = this.diagramEngine.getStateMachine().getCurrentState();
        if (state instanceof DefaultDiagramState) {
            state.dragNewLink.config.allowLooseLinks = false;
        }

        this.diagramEngine.getNodeFactories().registerFactory(new AdditionNodeFactory(this));
        this.diagramEngine.getNodeFactories().registerFactory(new MultiplicationNodeFactory(this));
        this.diagramEngine.getNodeFactories().registerFactory(new DivisionNodeFactory(this));
        this.diagramEngine.getNodeFactories().registerFactory(new SubtractionNodeFactory(this));
        this.diagramEngine.getNodeFactories().registerFactory(new InputNodeFactory(this));
        this.diagramEngine.getNodeFactories().registerFactory(new BaseNodeFactory(this));

        this.diagramEngine.getPortFactories().registerFactory(new ValuePortFactory());

        this.diagramEngine.getLinkFactories().registerFactory(new ValueLinkFactory());

        this.diagramEngine.getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [46] }));
        this.diagramEngine.getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [8], modifiers: { ctrlKey: true } }));

        let oldState = window.localStorage.getItem("state")
        if (oldState) {
            this.activeModel.deserializeModel(JSON.parse(oldState), this.diagramEngine);
        }

        this.diagramEngine.setModel(this.activeModel);

        this.diagramEngine.registerListener({
            nodesUpdated: (e) => {  },
            linksUpdated: (e) => {  },
        })
        // @ts-ignore
        this.activeModel.registerListener({
            eventDidFire: (e) => {
                this.activeModel.getNodes().forEach(node => {
                    const iNode = node as BaseNode;
                    if (iNode.getParents().length === 0) {
                        iNode.updateTree()
                    }
                })
                // @ts-ignore
                this.listeners.forEach(a => a.forceUpdate())
            },
            linksUpdated: (event) => {
                this.activeModel.getNodes().forEach(node => {
                    const iNode = node as BaseNode;
                    if (iNode.getParents().length === 0) {
                        iNode.updateTree()
                    }
                })
                // @ts-ignore
                this.listeners.forEach(a => a.forceUpdate())
            }
        });

        setInterval(() => {
            window.localStorage.setItem("state", JSON.stringify(this.activeModel.serialize()))
            console.log("Saved!")
        }, 2000)

    }

    public getActiveDiagram(): DiagramModel {
        return this.activeModel;
    }

    public getDiagramEngine(): DiagramEngine {
        return this.diagramEngine;
    }

    public onUpdate(node: InputNodeModel) {
        node.updateTree()

        // @ts-ignore
        this.listeners.forEach(a => a.forceUpdate())
        this.callback()
    }

    public afterUpdate(cbk: () => void) {
        this.callback = cbk
    }

    public addListener(listener: any) {
        // @ts-ignore
        this.listeners.push(listener)
    }
}