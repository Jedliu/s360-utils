// credits https://github.com/satya164/jest-file-snapshot

import filenamify = require('filenamify');
import path = require('path');
import mkdirp = require('mkdirp');
import * as colors from 'colors';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { diff } from 'jest-diff';

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchFileSnapshot(snapFilePath?: string, addNameIndex?: boolean): R;
    }
    interface Expect {
      toMatchFileSnapshot(snapFilePath?: string, addNameIndex?: boolean): any;
    }
  }
}

expect.extend({
  toMatchFileSnapshot(
    content: string | Buffer,
    snapFilePath?: string,
    addNameIndex = false
  ) {
    const { isNot, snapshotState, currentTestName, assertionCalls, testPath } =
      this;

    let ext = '',
      genFileName = '';

    if (snapFilePath) {
      ext = path.extname(snapFilePath);
      if (ext == '.ts' && !content.includes('@ts-nocheck')) {
        content = `// @ts-nocheck\n` + content;
      }
      genFileName = snapFilePath.replace(new RegExp(ext + '$'), '');
      // should we append index to the file name
      genFileName += addNameIndex ? `-${assertionCalls}` : '';
    }
    const genTestName = filenamify(currentTestName, {
      replacement: '-',
    }).replace(/\s/g, '-');

    const subPath = snapFilePath
      ? `${genFileName}${ext}.filesnap`
      : `${genTestName}-${assertionCalls}.filesnap`;

    const filePath = path.join(
      path.dirname(testPath),
      '__snapshots__',
      path.basename(testPath),
      subPath
    );
    const actualFileName = path.basename(filePath);
    const relativeFilePath = filePath.replace(process.cwd() + '/', '');

    // Options for jest-diff
    const options = {
      diff: {
        expand: false,
        contextLines: 5,
        aAnnotation: 'Snapshot',
      },
    };

    if (snapshotState._updateSnapshot === 'none' && !existsSync(filePath)) {
      // We're probably running in CI environment

      snapshotState.unmatched++;
      return {
        pass: isNot,
        message: () =>
          `New output file ` +
          colors.blue(actualFileName) +
          `was ${colors.bold.red('not written')}.\n\n` +
          'The update flag must be explicitly passed to write a new snapshot.\n\n' +
          `This is likely because this test is run in a ` +
          colors.blue('continuous integration (CI) environment') +
          ` in which snapshots are not written by default.\n\n`,
      };
    }

    if (existsSync(filePath)) {
      const output = readFileSync(
        filePath,
        Buffer.isBuffer(content) ? null : 'utf8'
      );

      if (isNot) {
        // The matcher is being used with `.not`

        if (!isEqual(content, output)) {
          // The value of `pass` is reversed when used with `.not`
          return { pass: false, message: () => '' };
        } else {
          snapshotState.unmatched++;

          return {
            pass: true,
            message: () =>
              `Expected received content ` +
              colors.red('to not match') +
              ` the file ${colors.blue(actualFileName)}.`,
          };
        }
      } else {
        if (isEqual(content, output)) {
          return { pass: true, message: () => '' };
        } else {
          if (snapshotState._updateSnapshot === 'all') {
            mkdirp.sync(path.dirname(filePath));
            writeFileSync(filePath, content);

            snapshotState.updated++;

            return { pass: true, message: () => '' };
          } else {
            snapshotState.unmatched++;

            const difference =
              Buffer.isBuffer(content) || Buffer.isBuffer(output)
                ? ''
                : '\n\n' + diff(output, content, options.diff);

            return {
              pass: false,
              message: () =>
                `Received content ${colors.red("doesn't match")} ` +
                `the file ${colors.blue(actualFileName)}\n` +
                `Snap file path ${colors.blue(relativeFilePath)}` +
                difference,
            };
          }
        }
      }
    } else {
      if (
        !isNot &&
        (snapshotState._updateSnapshot === 'new' ||
          snapshotState._updateSnapshot === 'all')
      ) {
        mkdirp.sync(path.dirname(filePath));
        writeFileSync(filePath, content);

        snapshotState.added++;

        return { pass: true, message: () => '' };
      } else {
        snapshotState.unmatched++;

        return {
          pass: true,
          message: () =>
            `The output file ${colors.blue(actualFileName)} ` +
            colors.bold.red("doesn't exist"),
        };
      }
    }
  },
});

const isEqual = (a: any, b: any) => {
  return Buffer.isBuffer(a) ? a.equals(b) : a == b;
};
