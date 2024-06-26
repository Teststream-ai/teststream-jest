import Logger from './lib/logger';
declare class TestStreamAPI {
    private serverUrl;
    private apiKey;
    private logger;
    constructor(apiKey: string, logger: Logger, serverUrl: string);
    createProject(data: any): Promise<any>;
    getProjectBySlug(slugId: string): Promise<any[] | undefined>;
    createRun(data: any): Promise<any | undefined>;
    completeRun(runId: string): Promise<any | undefined>;
    createRunSpec(data: any): Promise<any | undefined>;
    findUniqueSpec(runId: string, spec: string): Promise<any | undefined>;
    createBulkTestResults(data: any): Promise<any | undefined>;
}
export default TestStreamAPI;
