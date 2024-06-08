declare class TestStreamAPI {
    private serverUrl;
    private apiKey;
    constructor(apiKey: string, serverUrl?: string);
    createProject(data: any): Promise<any>;
    getProjectBySlug(slugId: string): Promise<any[] | undefined>;
    createRun(data: any): Promise<any | undefined>;
    createRunSpecBulk(data: any): Promise<any | undefined>;
    findUniqueSpec(runId: string, spec: string): Promise<any | undefined>;
    createBulkTestResults(data: any): Promise<any | undefined>;
}
export default TestStreamAPI;
