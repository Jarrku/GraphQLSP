import { expect, afterAll, beforeAll, it, describe } from 'vitest';
import { TSServer } from './server';
import path from 'node:path';
import fs from 'node:fs';
import url from 'node:url';
import ts from 'typescript/lib/tsserverlibrary';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const projectPath = path.resolve(__dirname, 'fixture-project-unused-fields');
describe('unused fields', () => {
  const outfileDestructuringFromStart = path.join(
    projectPath,
    'immediate-destructuring.tsx'
  );
  const outfileDestructuring = path.join(projectPath, 'destructuring.tsx');
  const outfileFragmentDestructuring = path.join(
    projectPath,
    'fragment-destructuring.tsx'
  );
  const outfileFragment = path.join(projectPath, 'fragment.tsx');
  const outfilePropAccess = path.join(projectPath, 'property-access.tsx');

  let server: TSServer;
  beforeAll(async () => {
    server = new TSServer(projectPath, { debugLog: false });

    server.sendCommand('open', {
      file: outfileDestructuring,
      fileContent: '// empty',
      scriptKindName: 'TS',
    } satisfies ts.server.protocol.OpenRequestArgs);
    server.sendCommand('open', {
      file: outfileFragment,
      fileContent: '// empty',
      scriptKindName: 'TS',
    } satisfies ts.server.protocol.OpenRequestArgs);
    server.sendCommand('open', {
      file: outfilePropAccess,
      fileContent: '// empty',
      scriptKindName: 'TS',
    } satisfies ts.server.protocol.OpenRequestArgs);
    server.sendCommand('open', {
      file: outfileFragmentDestructuring,
      fileContent: '// empty',
      scriptKindName: 'TS',
    } satisfies ts.server.protocol.OpenRequestArgs);
    server.sendCommand('open', {
      file: outfileDestructuringFromStart,
      fileContent: '// empty',
      scriptKindName: 'TS',
    } satisfies ts.server.protocol.OpenRequestArgs);

    server.sendCommand('updateOpen', {
      openFiles: [
        {
          file: outfileDestructuring,
          fileContent: fs.readFileSync(
            path.join(projectPath, 'fixtures/destructuring.tsx'),
            'utf-8'
          ),
        },
        {
          file: outfileFragment,
          fileContent: fs.readFileSync(
            path.join(projectPath, 'fixtures/fragment.tsx'),
            'utf-8'
          ),
        },
        {
          file: outfilePropAccess,
          fileContent: fs.readFileSync(
            path.join(projectPath, 'fixtures/property-access.tsx'),
            'utf-8'
          ),
        },
        {
          file: outfileDestructuringFromStart,
          fileContent: fs.readFileSync(
            path.join(projectPath, 'fixtures/immediate-destructuring.tsx'),
            'utf-8'
          ),
        },
        {
          file: outfileFragmentDestructuring,
          fileContent: fs.readFileSync(
            path.join(projectPath, 'fixtures/fragment-destructuring.tsx'),
            'utf-8'
          ),
        },
      ],
    } satisfies ts.server.protocol.UpdateOpenRequestArgs);

    server.sendCommand('saveto', {
      file: outfileDestructuring,
      tmpfile: outfileDestructuring,
    } satisfies ts.server.protocol.SavetoRequestArgs);
    server.sendCommand('saveto', {
      file: outfileFragment,
      tmpfile: outfileFragment,
    } satisfies ts.server.protocol.SavetoRequestArgs);
    server.sendCommand('saveto', {
      file: outfilePropAccess,
      tmpfile: outfilePropAccess,
    } satisfies ts.server.protocol.SavetoRequestArgs);
    server.sendCommand('saveto', {
      file: outfileFragmentDestructuring,
      tmpfile: outfileFragmentDestructuring,
    } satisfies ts.server.protocol.SavetoRequestArgs);
    server.sendCommand('saveto', {
      file: outfileDestructuringFromStart,
      tmpfile: outfileDestructuringFromStart,
    } satisfies ts.server.protocol.SavetoRequestArgs);
  });

  afterAll(() => {
    try {
      fs.unlinkSync(outfileDestructuring);
      fs.unlinkSync(outfileFragment);
      fs.unlinkSync(outfilePropAccess);
      fs.unlinkSync(outfileFragmentDestructuring);
      fs.unlinkSync(outfileDestructuringFromStart);
    } catch {}
  });

  it('gives unused fields with fragments', async () => {
    await server.waitForResponse(
      e =>
        e.type === 'event' &&
        e.event === 'semanticDiag' &&
        e.body?.file === outfileFragment
    );
    const res = server.responses.filter(
      resp =>
        resp.type === 'event' &&
        resp.event === 'semanticDiag' &&
        resp.body?.file === outfileFragment
    );
    expect(res[0].body.diagnostics).toMatchInlineSnapshot(`
      [
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 10,
            "offset": 15,
          },
          "start": {
            "line": 10,
            "offset": 9,
          },
          "text": "Field 'attacks.fast.damage' is not used.",
        },
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 11,
            "offset": 13,
          },
          "start": {
            "line": 11,
            "offset": 9,
          },
          "text": "Field 'attacks.fast.name' is not used.",
        },
      ]
    `);
  }, 30000);

  it('gives unused fields with fragments destructuring', async () => {
    await server.waitForResponse(
      e =>
        e.type === 'event' &&
        e.event === 'semanticDiag' &&
        e.body?.file === outfileFragmentDestructuring
    );
    const res = server.responses.filter(
      resp =>
        resp.type === 'event' &&
        resp.event === 'semanticDiag' &&
        resp.body?.file === outfileFragmentDestructuring
    );
    expect(res[0].body.diagnostics).toMatchInlineSnapshot(`
      [
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 10,
            "offset": 15,
          },
          "start": {
            "line": 10,
            "offset": 9,
          },
          "text": "Field 'attacks.fast.damage' is not used.",
        },
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 11,
            "offset": 13,
          },
          "start": {
            "line": 11,
            "offset": 9,
          },
          "text": "Field 'attacks.fast.name' is not used.",
        },
      ]
    `);
  }, 30000);

  it('gives semantc diagnostics with property access', async () => {
    await server.waitForResponse(
      e =>
        e.type === 'event' &&
        e.event === 'semanticDiag' &&
        e.body?.file === outfilePropAccess
    );
    const res = server.responses.filter(
      resp =>
        resp.type === 'event' &&
        resp.event === 'semanticDiag' &&
        resp.body?.file === outfilePropAccess
    );
    expect(res[0].body.diagnostics).toMatchInlineSnapshot(`
      [
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 11,
            "offset": 15,
          },
          "start": {
            "line": 11,
            "offset": 7,
          },
          "text": "Field 'pokemon.fleeRate' is not used.",
        },
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 16,
            "offset": 17,
          },
          "start": {
            "line": 16,
            "offset": 11,
          },
          "text": "Field 'pokemon.attacks.special.damage' is not used.",
        },
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 20,
            "offset": 16,
          },
          "start": {
            "line": 20,
            "offset": 9,
          },
          "text": "Field 'pokemon.weight.minimum' is not used.",
        },
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 21,
            "offset": 16,
          },
          "start": {
            "line": 21,
            "offset": 9,
          },
          "text": "Field 'pokemon.weight.maximum' is not used.",
        },
        {
          "category": "error",
          "code": 2578,
          "end": {
            "line": 3,
            "offset": 20,
          },
          "start": {
            "line": 3,
            "offset": 1,
          },
          "text": "Unused '@ts-expect-error' directive.",
        },
      ]
    `);
  }, 30000);

  it('gives unused fields with destructuring', async () => {
    const res = server.responses.filter(
      resp =>
        resp.type === 'event' &&
        resp.event === 'semanticDiag' &&
        resp.body?.file === outfileDestructuring
    );
    expect(res[0].body.diagnostics).toMatchInlineSnapshot(`
      [
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 15,
            "offset": 15,
          },
          "start": {
            "line": 15,
            "offset": 11,
          },
          "text": "Field 'pokemon.attacks.special.name' is not used.",
        },
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 16,
            "offset": 17,
          },
          "start": {
            "line": 16,
            "offset": 11,
          },
          "text": "Field 'pokemon.attacks.special.damage' is not used.",
        },
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 23,
            "offset": 11,
          },
          "start": {
            "line": 23,
            "offset": 7,
          },
          "text": "Field 'pokemon.name' is not used.",
        },
        {
          "category": "error",
          "code": 2578,
          "end": {
            "line": 3,
            "offset": 20,
          },
          "start": {
            "line": 3,
            "offset": 1,
          },
          "text": "Unused '@ts-expect-error' directive.",
        },
      ]
    `);
  }, 30000);

  it('gives unused fields with immedaite destructuring', async () => {
    const res = server.responses.filter(
      resp =>
        resp.type === 'event' &&
        resp.event === 'semanticDiag' &&
        resp.body?.file === outfileDestructuringFromStart
    );
    expect(res[0].body.diagnostics).toMatchInlineSnapshot(`
      [
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 15,
            "offset": 15,
          },
          "start": {
            "line": 15,
            "offset": 11,
          },
          "text": "Field 'pokemon.attacks.special.name' is not used.",
        },
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 16,
            "offset": 17,
          },
          "start": {
            "line": 16,
            "offset": 11,
          },
          "text": "Field 'pokemon.attacks.special.damage' is not used.",
        },
        {
          "category": "warning",
          "code": 52005,
          "end": {
            "line": 23,
            "offset": 11,
          },
          "start": {
            "line": 23,
            "offset": 7,
          },
          "text": "Field 'pokemon.name' is not used.",
        },
        {
          "category": "error",
          "code": 2578,
          "end": {
            "line": 3,
            "offset": 20,
          },
          "start": {
            "line": 3,
            "offset": 1,
          },
          "text": "Unused '@ts-expect-error' directive.",
        },
      ]
    `);
  }, 30000);
});
