const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const path = require('path');

function extractAndProcessFilenames(paths) {
  return paths.map(path => {
    return path.startsWith('./') ? path.slice(2) : path;
  });
}

export async function scanTestFiles() {
  try {
    const { stdout } = await execAsync('find . -type f -name "*.spec.*"');
    const files = stdout.split('\n').filter(line => line !== '');
    let updatedFileNames = extractAndProcessFilenames(files);
    
    return updatedFileNames;

  } catch (error) {
    console.error('Error generating test files list:', error);
  }
}

// Example usage
(async () => {
  const files = await scanTestFiles();
})();



export function getPathDifference(path1, path2) {
  // Normalize the paths to avoid issues with different separators
  const normalizedPath1 = path.normalize(path1);
  const normalizedPath2 = path.normalize(path2);

  // Split the paths into components
  const parts1 = normalizedPath1.split(path.sep);
  const parts2 = normalizedPath2.split(path.sep);

  // Find the common prefix
  let commonIndex = 0;
  while (commonIndex < Math.min(parts1.length, parts2.length) && parts1[commonIndex] === parts2[commonIndex]) {
      commonIndex++;
  }

  // Get the difference parts
  const differenceParts1 = parts1.slice(commonIndex);
  const differenceParts2 = parts2.slice(commonIndex);

  // Return the differences as strings
  return {
      path1Difference: differenceParts1.join(path.sep),
      path2Difference: differenceParts2.join(path.sep)
  };
}
