import {BaseNode} from "../BaseNode";

export class MultiplicationNodeModel extends BaseNode {
    processParentValues(values: any[]): any {
        return values.reduce((a, b) => a * b, 1)
    }
}