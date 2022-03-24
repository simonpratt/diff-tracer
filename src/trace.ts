import { exec } from 'child_process';
import glob from 'glob';
import dependencyTree from 'dependency-tree';

const findTestFiles = (pattern: string): string[] => {
  const files = glob.sync(pattern);
  return files;
}

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
    })
  })
}

const findFilesWithChangedDependencies = (testFiles: string[], changedFiles: string[]) => {
  const changed = testFiles.filter(testFile => {
    const dependencies: string[] = dependencyTree({ filename: testFile, directory: 'example', isListForm: true }) as any;
    const relativeDependencies = dependencies.map(d => d.replace(`${process.cwd()}/`, ''));

    return changedFiles.some(file => relativeDependencies.includes(file));
  })

  return changed;
}

const main = async () => {
  const files = findTestFiles('example/**/*.test.ts');
  const diff = await findChangedFiles('master');
  const changed = findFilesWithChangedDependencies(files, diff);

  process.stdout.write(changed.join(','));
}

main();