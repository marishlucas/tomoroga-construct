import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

// Compile the two framework-independent modules using the project's existing compiler.
const directory = await mkdtemp(join(tmpdir(), 'tomoroga-enquiry-'));
for (const name of ['enquiry', 'enquiry-server']) {
  const source = await readFile(
    new URL(`../lib/${name}.ts`, import.meta.url),
    'utf8',
  );
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  await writeFile(
    join(directory, `${name}.mjs`),
    outputText.replace("'./enquiry'", "'./enquiry.mjs'"),
  );
}
const { handleEnquiry } = await import(
  pathToFileURL(join(directory, 'enquiry-server.mjs')).href
);
const { emptyEnquiry, validateEnquiry } = await import(
  pathToFileURL(join(directory, 'enquiry.mjs')).href
);
after(() => rm(directory, { recursive: true, force: true }));
const valid = {
  ...emptyEnquiry,
  projectType: 'Casă / clădire civilă',
  locality: 'Cluj-Napoca',
  name: 'Preview Test',
  phone: '+40 740 000 000',
  requestId: '690a9ec2-ae5d-40a1-a2ce-712fd7718b2c',
};
const request = (body = valid, origin = 'https://example.test') =>
  new Request('https://example.test/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  });
const unexpected = async () => {
  throw Error('Unexpected delivery call');
};

test('step one requires only project type and locality', () => {
  assert.deepEqual(
    validateEnquiry(
      {
        ...emptyEnquiry,
        projectType: valid.projectType,
        locality: valid.locality,
      },
      1,
    ),
    {},
  );
  assert.deepEqual(Object.keys(validateEnquiry(emptyEnquiry, 1)), [
    'projectType',
    'locality',
  ]);
});
test('one valid preferred contact method is sufficient', () => {
  assert.deepEqual(validateEnquiry(valid), {});
  assert.deepEqual(
    validateEnquiry({
      ...valid,
      phone: '',
      contactMethod: 'email',
      email: 'test@example.test',
    }),
    {},
  );
  assert.ok(validateEnquiry({ ...valid, phone: 'not a phone' }).phone);
  assert.ok(
    validateEnquiry({ ...valid, contactMethod: 'email', email: 'invalid' })
      .email,
  );
  assert.ok(validateEnquiry({ ...valid, area: '-1' }).area);
});
test('invalid, cross-origin and honeypot requests never reach delivery', async () => {
  const config = {
    apiKey: 'test',
    from: 'test@example.test',
    fetcher: unexpected,
  };
  assert.equal(
    (await handleEnquiry(request({ ...valid, name: '' }), config)).status,
    422,
  );
  assert.equal(
    (await handleEnquiry(request(valid, 'https://unrelated.test'), config))
      .status,
    403,
  );
  assert.equal(
    (await handleEnquiry(request({ ...valid, website: 'spam' }), config))
      .status,
    422,
  );
  assert.equal(
    (await handleEnquiry(request({ ...valid, stage: 'invented' }), config))
      .status,
    422,
  );
  assert.equal(
    (
      await handleEnquiry(
        request({ ...valid, details: 'x'.repeat(13000) }),
        config,
      )
    ).status,
    413,
  );
});
test('unconfigured delivery fails honestly instead of reporting success', async () => {
  const response = await handleEnquiry(request(), { fetcher: unexpected });
  assert.equal(response.status, 503);
  assert.ok(!(await response.json()).ok);
});
test('sends a validated brief only to the fixed company inbox', async () => {
  let sent;
  const response = await handleEnquiry(
    request({
      ...valid,
      contactMethod: 'email',
      email: 'test@example.test',
      details: 'A <building> & a plan.',
    }),
    {
      apiKey: 'test',
      from: 'Forms <forms@example.test>',
      fetcher: async (url, options) => {
        sent = { url, options, payload: JSON.parse(options.body) };
        return Response.json({ id: 'fake-provider-id' });
      },
    },
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(sent.payload.to, ['office@tomorogaconstruct.ro']);
  assert.equal(sent.payload.reply_to, 'test@example.test');
  assert.match(sent.payload.text, /A <building> & a plan\./);
  assert.equal(sent.payload.html, undefined);
  assert.equal(
    sent.options.headers['Idempotency-Key'],
    `enquiry/${valid.requestId}`,
  );
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
test('provider errors and incomplete acknowledgements never become success', async () => {
  for (const result of [
    new Response('provider error', { status: 429 }),
    Response.json({}),
  ]) {
    const response = await handleEnquiry(request(), {
      apiKey: 'test',
      from: 'test@example.test',
      fetcher: async () => result,
    });
    assert.equal(response.status, 502);
  }
});
