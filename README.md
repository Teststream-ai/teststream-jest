# TeststreamReporter

Teststream-jest is a custom reporter for Jest that integrates with TestStreamAPI to log and manage test runs, collect and report test results, and upload them to the Teststream platform.

## Installation

To install the Teststream jest package, run:

```
npm i teststream-jest
```

## Usage

To use the this reporter in your Jest configuration, add it to the `reporters` field in `jest.config.js`:

```js
module.exports = {
  reporters: [
    'default',
    ['teststream-jest', {
      apiKey: 'your-teststream-api-key',
      projectID: 'your-project-slug',
      runName: 'your-custom-run-name',
    }],
  ],
  // Other Jest configurations
};
```

## Configuration Options

Here are the possible options you can define in your `jest.config.js` for the `TeststreamReporter`:

- `apiKey`: **(required)** Your API key for authenticating with TestStreamAPI.
- `projectID`: **(required)** The slug of the project in Teststream.
- `runName`: **(optional)** Custom name for the test run. If not provided, a default name with the current date and time will be used.
