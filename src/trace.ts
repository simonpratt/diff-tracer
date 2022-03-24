import glob from 'glob';

const findTestFiles = (pattern: string): string[] => {
  const files = glob.sync(pattern);
  return files;
}

const main = () => {
  const files = findTestFiles('example/**/*.test.ts');
  console.log(files);
}

main();