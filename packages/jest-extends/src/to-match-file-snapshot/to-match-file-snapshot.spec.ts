import './to-match-file-snapshot';

import { readFileSync } from 'fs';
import path = require('path');

describe('Test to-match-file-snapshot', () => {
  const content = `match file snapshot content`;
  let folder: string;
  let snapRootFolder: string;

  beforeAll(() => {
    const fileName = path.basename(__filename);
    snapRootFolder = path.join(
      __filename.replace(fileName, ''),
      '__snapshots__'
    );
    folder = path.join(snapRootFolder, fileName);
  });

  const getSnapshot = (snapFileName: string, rootFolder = false) => {
    return readFileSync(
      path.join(rootFolder ? snapRootFolder : folder, snapFileName)
    ).toString();
  };

  it('should see the correct result', async () => {
    expect(content).toMatchFileSnapshot();
    expect(
      getSnapshot(
        'Test-to-match-file-snapshot-should-see-the-correct-result-0.filesnap'
      )
    ).toEqual(content);
  });

  it('should see the correct result when provide the filename', async () => {
    expect(content).toMatchFileSnapshot('folder/test-file');
    expect(getSnapshot('folder/test-file.filesnap')).toEqual(content);
  });

  it('should see the correct result when provide the filename and add name index', async () => {
    expect(content).toMatchFileSnapshot('folder/test-file', true, true);
    expect(getSnapshot('folder/test-file-0.filesnap')).toEqual(content);
  });

  it('should see the correct result when eachFolderPerTest parameter is false', async () => {
    expect(content).toMatchFileSnapshot('save-to-root-of-snapshots', false);
    expect(getSnapshot('save-to-root-of-snapshots.filesnap', true)).toEqual(
      content
    );
  });

  it('should add @ts-nocheck in the file when it is a ts file', async () => {
    expect(content).toMatchFileSnapshot('folder/test-file.ts');
    expect(getSnapshot('folder/test-file.ts.filesnap')).toEqual(
      '// @ts-nocheck\n' + content
    );
  });
});
