import {BaseNode} from "../BaseNode";

export class AdditionNodeModel extends BaseNode {
    processParentValues(values: any[]): any {
        return values.reduce((a, b) => a + b, 0)
    }
}