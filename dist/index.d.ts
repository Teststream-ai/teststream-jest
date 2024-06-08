import { Reporter, ReporterOnStartOptions, Test, TestContext, TestResult } from '@jest/reporters';
import { AggregatedResult } from '@jest/test-result';
import { Config } from '@jest/types';
export default class TeststreamReporter implements Reporter {
    private config;
    protected api: any;
    protected logger: any;
    protected _options?: any;
    private runName;
    constructor(config: Config.InitialOptions, options: any, runName: string);
    private init;
    onTestFileResult(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult): Promise<void>;
    onRunStart(results: AggregatedResult, options: ReporterOnStartOptions): void;
    onRunComplete(context: Set<TestContext>, results: AggregatedResult): void;
}
