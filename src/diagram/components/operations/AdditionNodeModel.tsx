import {BaseNode} from "../base/BaseNode";
import {DeserializeEvent} from "@projectstorm/react-diagrams";

export class AdditionNodeModel extends BaseNode {
    constructor(name: string, color: string) {
        super({ name, type: 'addition' }, color);
    }

    processParentValues(values: any[]): any {
        console.log(values)
        return Number(values.reduce((a, b) => Number(a) + Number(b), 0))
    }

    serialize(): any {
        return super.serialize();
    }

    deserialize(event: DeserializeEvent<this>) {
        super.deserialize(event);
    }
}