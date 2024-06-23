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
import { getPathDifference, scanTestFiles } from './lib/scan';
import chalk from 'chalk';
import Logger from './lib/logger';
import { statusMapping } from './lib/status';

type CustomReporter = Pick<Reporter, 'onRunComplete'>;

export default class TeststreamReporter implements Reporter {
  protected api;
  protected logger;
  protected _options?: any;
  private runName: string;
  // protected _globalConfig: Config.GlobalConfig;
  // Add the config to our constructor
  constructor(private config: Config.InitialOptions, options: any, runName: string) {
    this._options = options;
    const api = options.serverUrl || 'https://api.mayven.one';
    this.logger = new Logger();
    this.api = new TestStreamAPI(options.apiKey, this.logger, api);
    this.runName = this._options.runName;
  }

  private async init() {
    this.logger.info('Starting JEST automation test run');
    const projectId = process.env.PROJECT_ID;
    if (!projectId) {
      try {
        const data: any = await this.api.getProjectBySlug(
          this._options.projectID
        );
        process.env['PROJECT_ID'] = data?.id;
        this.logger.info(
          `Project found. Using ${data.name} project with slug ${data.slug}.`
        );
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    } else {
      this.logger.info(`Project found. Using project with slug ${projectId}`);
    }
    let runDetails;
    //const runId = process.env.RUN_ID;
    try {
      runDetails = await this.api.createRun({
        name: this.runName || 'Automation run ' + new Date().toLocaleString(),
        projectId: process.env.PROJECT_ID,
      });
      process.env['RUN_ID'] = runDetails.id;
    } catch (error) {
      console.log(error);
    }

    this.logger.info(
      `New run successfully created. Run name ${runDetails.name}`
    );
    let a = await scanTestFiles();
    const body = a.map((item) => {
      return { runId: process.env.RUN_ID, spec: item };
    });
    const data = await this.api.createRunSpecBulk(body);
  }

  async onTestFileResult(
    test: Test,
    testResult: TestResult,
    aggregatedResult: AggregatedResult
  ) {
    const path = getPathDifference(
      process.cwd(),
      testResult.testFilePath
    ).path2Difference;
    const b = await this.api.findUniqueSpec(process.env.RUN_ID as string, path);
    const results = extractTestResults(testResult.testResults, b.id);
    await this.api.createBulkTestResults(results);
    this.logger.info(
      `Run spec completed. Results of test ${path} can be found here.`
    );
  }

  onRunStart(results: AggregatedResult, options: ReporterOnStartOptions) {
    this.init();
    this.logger.info('Run started');
  }

  onRunComplete(context: Set<TestContext>, results: AggregatedResult) {
    this.logger.info(
      'Run successfully complete. Results are uploaded to Teststream'
    );
  }
}

const extractTestResults = (testResults: any[], runSpecId) => {
  return testResults.map((item: any) => {
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
