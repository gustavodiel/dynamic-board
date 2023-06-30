import * as _ from 'lodash';
import {
    DefaultNodeModelOptions,
    DefaultPortModel, DeserializeEvent,
    PortModelAlignment
} from '@projectstorm/react-diagrams';
import {BaseNode} from "../components/BaseNode";
import {ValueLinkModel} from "../components/ValueLinkModel";

export class InputNodeModel extends BaseNode {
    constructor(name: string, color: string) {
        super({
            type: 'input',
            name: name,
        }, color);
        this.portsOut = [];
        this.portsIn = [];
    }

    // doClone(lookupTable: {}, clone: any): void {
    //     clone.portsIn = [];
    //     clone.portsOut = [];
    //     super.doClone(lookupTable, clone);
    // }

    // deserialize(event: DeserializeEvent<this>) {
    //     super.deserialize(event);
    //     this.options.name = event.data.name;
    //     this.options.color = event.data.color;
    //     this.portsIn = _.map(event.data.portsInOrder, (id) => {
    //         return this.getPortFromID(id);
    //     }) as DefaultPortModel[];
    //     this.portsOut = _.map(event.data.portsOutOrder, (id) => {
    //         return this.getPortFromID(id);
    //     }) as DefaultPortModel[];
    // }
    //
    // serialize(): any {
    //     return {
    //         ...super.serialize(),
    //         name: this.options.name,
    //         color: this.options.color,
    //         portsInOrder: _.map(this.portsIn, (port) => {
    //             return port.getID();
    //         }),
    //         portsOutOrder: _.map(this.portsOut, (port) => {
    //             return port.getID();
    //         })
    //     };
    // }

    getChildren(): ValueLinkModel[] {
        let children: ValueLinkModel[] = [];

        this.getOutPorts().forEach(port => {
            Object.values(port.getLinks()).forEach(link => {
                children.push(link as ValueLinkModel)
            })
        })

        return children;
    };
}