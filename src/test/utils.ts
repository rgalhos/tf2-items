export default class TestLog {
    private readonly name: string;
    private passed: any[] = [];
    private failed: any[] = [];

    constructor(name: string) {
        this.name = name;
    }

    public setPassed(func: string, ret: string) {
        this.passed.push({ _: this.name, "call": func, "return": ret });
    }

    public setFailed(func: string, error: Error | string) {
        this.failed.push({  _: this.name, "call": func, error });
    }

    public log() {
        if (this.passed.length > 0) {
            console.table(this.passed);
        }

        if (this.failed.length > 0) {
            console.table(this.failed);
        }
    }
}
