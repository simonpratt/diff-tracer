import { exec } from 'child_process';
import glob from 'glob';
import dependencyTree from 'dependency-tree';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .usage(
    'Run targeting a branch to discover what test files need to be run to ensure adequate coverage of current changes\n\nUsage: $0 [options]',
  )
  .options({
    branch: {
      alias: 'b',
      description: 'git branch to compare the current changes against',
      requiresArg: false,
      required: false,
      type: 'string',
    },
    spec: {
      alias: 's',
      description: 'subset of tests that are elegible for running',
      requiresArg: false,
      required: false,
      type: 'string',
    },
  })
  .default('branch', 'master')
  .default('spec', '**/*.test.ts').argv;

const findTestFiles = (pattern: string): string[] => {
  const files = glob.sync(pattern);
  return files;
};

const findChangedFiles = (branch: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    exec(`git diff ${branch} --name-only`, (err, out) => {
      if (err) {
        reject(err);
        return;
      }

      if (!out.length) {
        resolve([]);
        return;
      }

      const split = out.trim().split('\n');
      resolve(split);
    });
  });
};

const findFilesWithChangedDependencies = (testFiles: string[], changedFiles: string[]) => {
  const changed = testFiles.filter((testFile) => {
    const dependencies: string[] = dependencyTree({
      filename: testFile,
      directory: 'example',
      isListForm: true,
    }) as any;
    const relativeDependencies = dependencies.map((d) => d.replace(`${process.cwd()}/`, ''));

    return changedFiles.some((file) => relativeDependencies.includes(file));
  });

  return changed;
};

const run = async () => {
  const branch = (await argv).branch;
  const spec = (await argv).spec;

  const files = findTestFiles(spec!);
  const diff = await findChangedFiles(branch);
  const changed = findFilesWithChangedDependencies(files, diff);

  process.stdout.write(changed.join('\n'));
  process.stdout.write('\n');
};

export default run;
