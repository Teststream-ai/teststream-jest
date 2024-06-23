import axios from 'axios';
import Logger from './lib/logger';

class TestStreamAPI {
  private serverUrl: string;
  private apiKey: string;
  private logger: Logger


  constructor(apiKey: string,  logger: Logger, serverUrl: string) {
    this.apiKey = apiKey;
    this.serverUrl = serverUrl;
    this.logger = logger
  }

  public async createProject(data: any): Promise<any> {
    const response = await axios.post(this.serverUrl + '/api/projects', data);
    return response.data;
  }

  public async getProjectBySlug(slugId: string): Promise<any[] | undefined> {
    try {
      const response = await axios.get(
        this.serverUrl + '/api/testops/projects/' + slugId,
        {
          headers: {
            'x-teststream-api-key': this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.logger.error("Failed to get project. Run data won't be published")
      //console.error('Error fetching data: ', error);
    }
  }

  public async createRun(data: any): Promise<any | undefined> {
    try {
      const response = await axios.post(this.serverUrl + '/api/runs', data, {
        headers: {
          'x-teststream-api-key': this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error("Failed to create run!")
    }
  }

  public async createRunSpecBulk(data: any): Promise<any | undefined> {
    try {
      const response = await axios.post(this.serverUrl + '/api/run-spec', data, {
        headers: {
          'x-teststream-api-key': this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error("Failed to create run data");
    }
  }

  public async findUniqueSpec(runId: string, spec: string): Promise<any | undefined> {
    try {
      const response = await axios.get(this.serverUrl + '/api/run-spec', {
        params: {
          runId: runId,
          spec: spec,
        },
        headers: {
          'x-teststream-api-key': this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error("Failed to get spec ID");
    }
  }

  public async createBulkTestResults(data: any): Promise<any | undefined> {
    try {
      const response = await axios.post(this.serverUrl + '/api/results', data, {
        headers: {
          'x-teststream-api-key': this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error("Failed to publish test results");
    }
  }
}

export default TestStreamAPI;
