import {BaseNode} from "../BaseNode";

export class DivisionNodeModel extends BaseNode {
    processParentValues(values: any[]): any {
        return values.reduce((a, b) => b && b !== 0 ? a / b : 0, 0)
    }
}