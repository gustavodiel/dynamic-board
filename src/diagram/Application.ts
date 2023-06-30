import createEngine, {
    Action,
    ActionEvent,
    DefaultDiagramState, DeleteItemsAction,
    DiagramModel,
    InputType
} from '@projectstorm/react-diagrams';
import * as _ from 'lodash'
import {InputNodeFactory} from "./input/InputNodeFactory";
import {InputNodeModel} from "./input/InputNodeModel";
import {ValueLinkFactory} from "./components/ValueLinkModel";
import {BaseNodeFactory} from "./components/operations/BaseNodeFactory";
import {DiagramEngine} from "@projectstorm/react-diagrams-core";
import React from "react";
import {BaseNode} from "./components/BaseNode";

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

        this.diagramEngine.getNodeFactories().registerFactory(new InputNodeFactory(this));
        this.diagramEngine.getNodeFactories().registerFactory(new BaseNodeFactory(this));
        this.diagramEngine.getLinkFactories().registerFactory(new ValueLinkFactory());

        this.diagramEngine.getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [46] }));
        this.diagramEngine.getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [8], modifiers: { ctrlKey: true } }));

        let oldState = window.localStorage.getItem("state")
        if (oldState) {
            console.log("init!")

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
            Notification.requestPermission().then(function (permission) {
                let title = "Dynaboard";

                let body = "Salvo!";

                var notification = new Notification(title, { body });

            });
        }, 5000)

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