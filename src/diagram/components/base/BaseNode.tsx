import {ValueLinkModel, ValuePortModel} from "../ValueLinkModel";
import {DefaultNodeModel, DefaultNodeModelOptions, DeserializeEvent} from "@projectstorm/react-diagrams";
import {PortModelAlignment} from "@projectstorm/react-diagrams-core";

export interface InputNodeModelGenerics {
    OPTIONS: DefaultNodeModelOptions;
}

export class BaseNode extends DefaultNodeModel {
    // @ts-ignore
    protected portsIn: ValuePortModel[];
    // @ts-ignore
    protected portsOut: ValuePortModel[];
    private value: any;

    constructor(options: any, color: string) {
        if (typeof options === 'string') {
            options = {
                name: options,
                color: color
            };
        }

        super({...options, color});
        this.portsOut = [];
        this.portsIn = [];
    }

    serialize(): any {
        return {
            ...super.serialize(),
            value: Number(this.value),
        };
    }

    deserialize(event: DeserializeEvent<this>) {
        super.deserialize(event);

        this.value = Number(event.data.value);
    }

    setValue(newValue: any) {
        this.value = Number(newValue)
    };

    getValue() { return this.value }

    getChildren(): ValueLinkModel[] {
        let children: ValueLinkModel[] = [];

        this.getOutPorts().forEach(port => {
            Object.values(port.getLinks()).forEach(link => {
                console.log(link.getID())
                console.log(link.getType())
                // @ts-ignore
                console.log((link as object).constructor.name)
                children.push(link as ValueLinkModel)
            })
        })

        return children;
    };

    getParents(): ValueLinkModel[] {
        let children: ValueLinkModel[] = [];

        this.getInPorts().forEach(port => {
            Object.values(port.getLinks()).forEach(link => {
                children.push(link as ValueLinkModel)
            })
        })

        return children;
    };

    addInPort(label: string, after = true) {
        const p = new ValuePortModel({
            in: true,
            name: label,
            label: label,
            alignment: PortModelAlignment.LEFT
        });
        if (!after) {
            // @ts-ignore
            this.portsIn.splice(0, 0, p);
        }
        // @ts-ignore
        return this.addPort(p);
    }

    addOutPort(label: string, after = true) {
        const p = new ValuePortModel({
            in: false,
            name: label,
            label: label,
            alignment: PortModelAlignment.RIGHT
        });
        if (!after) {
            // @ts-ignore
            this.portsOut.splice(0, 0, p);
        }
        // @ts-ignore
        return this.addPort(p);
    }

    updateTree(): void {
        this.getChildren().forEach(children => {
            children.update && children.update(this)
        })
    };

    update() {
        let values: any[] = [];
        this.getParents().forEach(c => {
            values.push(c.getValue())
        })

        let newValue = this.processParentValues(values)

        this.setValue(newValue)

        this.updateTree()
    }

    processParentValues(values: any[]): any {
        return values
    }
}