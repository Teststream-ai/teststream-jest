import {
  Reporter,
  ReporterOnStartOptions,
  Test,
  TestContext,
  TestResult,
} from '@jest/reporters';
import { AggregatedResult } from '@jest/test-result';
import { Config } from '@jest/types';
import TestStreamAPI from './api';
import { getPathDifference } from './lib/scan';
import Logger from './lib/logger';
import { statusMapping } from './lib/status';

type CustomReporter = Pick<Reporter, 'onRunComplete'>;

export default class TeststreamReporter implements Reporter {
  protected api;
  protected logger;
  protected _options?: any;
  private runName: string;
  private runId: any;
  private initPromise: Promise<void>;

  constructor(private config: Config.InitialOptions, options: any, runName: string) {
    this._options = options;
    const api = options.serverUrl || 'https://api.mayven.one';
    this.logger = new Logger();
    this.api = new TestStreamAPI(options.apiKey, this.logger, api);
    this.runName = this._options.runName;
    this.initPromise = this.init();
  }

  private async init() {
    this.logger.info('Starting JEST automation test run');
    const projectId = process.env.PROJECT_ID;
    if (!projectId) {
      try {
        const data: any = await this.api.getProjectBySlug(this._options.projectID);
        process.env['PROJECT_ID'] = data?.id;
        this.logger.info(`Project found. Using ${data.name} project with slug ${data.slug}.`);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    } else {
      this.logger.info(`Project found. Using project with slug ${projectId}`);
    }
    let runDetails;
    try {
      runDetails = await this.api.createRun({
        name: this.runName || 'Automation run ' + new Date().toLocaleString(),
        projectId: process.env.PROJECT_ID,
      });
      process.env['RUN_ID'] = runDetails.id;
      this.runId = runDetails.id;
    } catch (error) {
      console.log(error);
    }

    this.logger.info(`New run successfully created. Run name ${runDetails.name}`);
  }

  async onTestFileResult(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult) {
    await this.initPromise;
    const path = getPathDifference(process.cwd(), testResult.testFilePath).path2Difference;
    const data = await this.api.createRunSpec({ runId: this.runId, spec: path });
    const results = await extractTestResults(testResult.testResults, data.id);
    await this.api.createBulkTestResults(results);
    this.logger.info(`Run spec completed. Results of test ${path} can be found here.`);
  }

  onRunStart(results: AggregatedResult, options: ReporterOnStartOptions) {
    this.logger.info('Run started');
  }

  onRunComplete(context: Set<TestContext>, results: AggregatedResult) {
    this.logger.info('Run successfully complete. Results are uploaded to Teststream');
    this.api.completeRun(this.runId);
  }
}

const extractTestResults = async (testResults: any[], runSpecId) => {
  return await testResults.map((item: any) => {
    return {
      runSpecId: runSpecId,
      title: item.title,
      fullTitle: item.fullName,
      duration: item.duration,
      status: statusMapping(item.status),
      suite: item.ancestorTitles[0],
      error: item.failureMessages[0] && stripAnsiCodes(item.failureMessages[0]),
    };
  });
};

function stripAnsiCodes(str) {
  // Regular expression to match ANSI escape codes
  const ansiRegex = /\x1B\[[0-9;]*[a-zA-Z]/g;
  return str.replace(ansiRegex, '').replace(/\n/g, ' ');
}
