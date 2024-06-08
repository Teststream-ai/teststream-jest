import axios from 'axios';

class TestStreamAPI {
  private serverUrl: string;
  private apiKey: string;


  constructor(apiKey: string, serverUrl: string = 'https://api.teststream.ai') {
    this.apiKey = apiKey;
    this.serverUrl = serverUrl;
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
      console.error('Error fetching data: ', error);
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
      console.error('Error fetching data: ', error);
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
      console.error('Error fetching data: ', error);
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
      console.error('Error fetching data: ', error);
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
      console.error('Error fetching data: ', error);
    }
  }
}

export default TestStreamAPI;
