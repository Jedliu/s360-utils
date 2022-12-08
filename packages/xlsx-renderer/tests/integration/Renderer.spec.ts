/* eslint-disable @typescript-eslint/no-var-requires */
import '@s360-utils/jest-extends';

import { Anchor, Workbook, Worksheet } from '@s360-utils/exceljs';
import { stripAnsi } from '@s360-utils/util-kits';
import * as fs from 'fs';
import { Dirent } from 'fs';
import * as path from 'path';

import { CellTemplateDebugPool } from '../../src/CellTemplateDebugPool';
import { Renderer } from '../../src/Renderer';

// TODO: it works for node 10+, for node 8/9 see git history
function isDir(dirPath: Dirent): boolean {
  return dirPath.isDirectory();
}

function getSimplestImages(x: Worksheet) {
  return x.getImages().map(({ imageId, range }) => {
    /**
     * TODO remove casting in the future
     * @see https://github.com/Siemienik/xlsx-renderer/pull/31#discussion_r446581091
     */
    const br = range.br as Anchor;
    const tl = range.tl as Anchor;

    return {
      imageId,
      brc: br.nativeCol,
      brcf: br.nativeColOff,
      brr: br.nativeRow,
      brrf: br.nativeRowOff,
      tlc: tl.nativeCol,
      tlcf: tl.nativeColOff,
      tlr: tl.nativeRow,
      tlrf: tl.nativeRowOff,
    };
  });
}

function assertCells(expected: Workbook, result: Workbook, factor = 10) {
  expect(expected.worksheets.length).toEqual(result.worksheets.length);
  expect(expected.worksheets.map((x) => x.name)).toEqual(
    result.worksheets.map((x) => x.name)
  );
  expect(expected.worksheets.map(getSimplestImages)).toEqual(
    result.worksheets.map(getSimplestImages)
  );

  for (let wi = 0; wi < expected.worksheets.length; wi++) {
    const ws = { e: expected.worksheets[wi], r: result.worksheets[wi] };
    for (let i = 0; i < factor * factor; i++) {
      const r = Math.floor(i / factor) + 1;
      const c = (i % factor) + 1;
      const cell = {
        e: ws.e.getCell(r, c),
        r: ws.r.getCell(r, c),
      };

      if (r === 1) {
        expect(ws.r.getColumn(c).width).toEqual(ws.e.getColumn(c).width);
      }
      if (c === 1) {
        expect(ws.r.getRow(r).height).toEqual(ws.e.getRow(r).height);
      }

      expect(cell.r.style).toEqual(cell.e.style);
      // TODO report bug, about merge cell which isn't a master. cell.text in that case throw error : `TypeError: Cannot read property 'toString' of null` (@see https://github.com/Siemienik/xlsx-renderer/issues/47)
      // TODO add to exceljs isMaster (@see https://github.com/exceljs/exceljs/issues/1400)
      // TODO update exceljs index.d.ts about cell.s (it misses cellvalues classes def) (@see https://github.com/Siemienik/xlsx-renderer/issues/44)
      if (!cell.r.isMerged || cell.r.address == cell.r.master.address) {
        if (!cell.e.isMerged || cell.e.address == cell.e.master.address) {
          expect(cell.r.text).toEqual(cell.e.text);
        }
      }
      expect(cell.r.value).toEqual(cell.e.value);
    }
  }
}

async function safe(cb: (...a: unknown[]) => void) {
  try {
    cb();
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.warn(e);
  }
}

describe('INTEGRATION:: Test xlsx renderer ', () => {
  it('check safe utility', async () => {
    const { warn } = console;

    let called = 0;
    // tslint:disable-next-line:no-console
    console.warn = () => {
      called++;
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    safe(() => {});
    expect(0).toEqual(called);

    safe(() => {
      throw new Error();
    });
    expect(1).toEqual(called);

    // tslint:disable-next-line:no-console
    console.warn = warn;
  });

  describe('Checking if assertCells works ok.', () => {
    it('Same - should pass ok', async () => {
      const expected = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'main.xlsx')
      );
      const correct = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'correct.xlsx')
      );
      const expectedImage = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'main-image.xlsx')
      );
      const correctImage = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'correct-image.xlsx')
      );
      // TODO important probably lack of assertions images assertion!

      assertCells(expected, correct, 20);
    });

    it('Different - attempt to broke assertions', async () => {
      const expected = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'main.xlsx')
      );
      const failedHeight = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'f-height.xlsx')
      );
      const failedStyle = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'f-style.xlsx')
      );
      const failedTable = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'f-table.xlsx')
      );
      const failedText = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'f-text.xlsx')
      );
      const failedValue = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'f-value.xlsx')
      );
      const failedWidth = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'f-width.xlsx')
      );
      const failedWorksheetAmount = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'f-ws-amount.xlsx')
      );
      const failedWorksheetNames = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'f-ws-names.xlsx')
      );

      try {
        assertCells(expected, failedHeight, 20);
      } catch ({ message }) {
        expect(stripAnsi(message as string)).toMatchFileSnapshot(
          'failed-height'
        );
      }

      try {
        assertCells(expected, failedStyle, 20);
      } catch ({ message }) {
        expect(stripAnsi(message as string)).toMatchFileSnapshot(
          'failed-style'
        );
      }

      try {
        assertCells(expected, failedTable, 20);
      } catch ({ message }) {
        expect(stripAnsi(message as string)).toMatchFileSnapshot(
          'failed-table'
        );
      }

      try {
        assertCells(expected, failedText, 20);
      } catch ({ message }) {
        expect(stripAnsi(message as string)).toMatchFileSnapshot('failed-text');
      }

      try {
        assertCells(expected, failedValue, 20);
      } catch ({ message }) {
        expect(stripAnsi(message as string)).toMatchFileSnapshot(
          'failed-value'
        );
      }

      try {
        assertCells(expected, failedWidth, 20);
      } catch ({ message }) {
        expect(stripAnsi(message as string)).toMatchFileSnapshot(
          'failed-width'
        );
      }

      try {
        assertCells(expected, failedWorksheetAmount, 20);
      } catch ({ message }) {
        expect(stripAnsi(message as string)).toMatchFileSnapshot(
          'failed-work-sheet-amount'
        );
      }

      try {
        assertCells(expected, failedWorksheetNames, 20);
      } catch ({ message }) {
        expect(stripAnsi(message as string)).toMatchFileSnapshot(
          'failed-work-sheet-names'
        );
      }

      const expectedImage = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'main-image.xlsx')
      );
      const failedImage = await new Workbook().xlsx.readFile(
        path.join(__dirname, 'data', 'assertCells', 'f-image.xlsx')
      );

      try {
        assertCells(expectedImage, failedImage, 20);
      } catch ({ message }) {
        expect(stripAnsi(message as string)).toMatchFileSnapshot(
          'failed-image'
        );
      }
    });
  });

  describe('Load examples, render and compare with expected result', () => {
    const dataPath = path.normalize(path.join(__dirname, 'data/'));
    const sets = fs
      .readdirSync(path.normalize(dataPath), { withFileTypes: true })
      .filter((d) => isDir(d) && /^Renderer[0-9]*-/.test(d.name));

    sets.forEach((file) => {
      it(`Test for  ${file.name}`, async () => {
        const renderer = new Renderer();
        const viewModelOriginal = require(path.join(
          dataPath,
          file.name,
          'viewModel.json'
        ));
        const viewModel = JSON.parse(JSON.stringify(viewModelOriginal));

        const result = await renderer.renderFromFile(
          path.join(dataPath, file.name, 'template.xlsx'),
          viewModel
        );

        // viewModel shouldn't be modified. @see https://github.com/Siemienik/XToolset/issues/137
        expect(viewModel).toEqual(viewModelOriginal);

        const expected = await new Workbook().xlsx.readFile(
          path.join(dataPath, file.name, 'expected.xlsx')
        );

        await safe(async () => {
          await result.xlsx.writeFile(
            path.join(dataPath, file.name, 'test-output.xlsx')
          );
        });

        assertCells(expected, result);
      });
    });

    const fixture = sets[5].name;
    it(`Test for ArrayBuffer import from ${fixture} with a debug`, async () => {
      const renderer = new Renderer(new CellTemplateDebugPool());
      const viewModelOriginal = require(path.join(
        dataPath,
        fixture,
        'viewModel.json'
      ));
      const viewModel = JSON.parse(JSON.stringify(viewModelOriginal));

      const result = await renderer.renderFromArrayBuffer(
        fs.readFileSync(path.join(dataPath, fixture, 'template.xlsx')),
        viewModel
      );

      // viewModel shouldn't be modified. @see https://github.com/Siemienik/XToolset/issues/137
      expect(viewModel).toEqual(viewModelOriginal);

      const expected = await new Workbook().xlsx.readFile(
        path.join(dataPath, fixture, 'expected.xlsx')
      );

      await safe(async () => {
        await result.xlsx.writeFile(
          path.join(dataPath, fixture, 'test-output.xlsx')
        );
      });

      assertCells(expected, result);
    });
  });
});
