import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { compile, preprocess } from 'svelte/compiler';
import { mdsvex } from 'mdsvex';
import { render } from 'svelte/server';

const root = fileURLToPath(new URL('../', import.meta.url));
const kb = path.join(root, 'support-kb');
const pages = {
  findings: 'incidents/4471-reassessment',
  decision: 'decisions/0002-dedupe-by-cause',
};

await build({
  root: kb,
  configFile: false,
  resolve: { alias: { '#lib': path.join(kb, 'src/lib') } },
  plugins: [{
    name: 'kb-svelte-ssr',
    async transform(source, id) {
      if (!/\.(svelte|svx)$/.test(id)) return;
      const code = id.endsWith('.svx')
        ? (await preprocess(source, mdsvex({}), { filename: id })).code
        : source;
      return { code: compile(code, { filename: id, generate: 'server', css: 'injected' }).js.code, map: null };
    },
  }],
  build: {
    ssr: true,
    outDir: path.join(root, '.build'),
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(Object.entries(pages).map(([name, route]) => [name, path.join(kb, `src/routes/kb/${route}/+page.svx`)])),
      output: { entryFileNames: '[name].mjs' },
    },
  },
});

await fs.mkdir(path.join(root, 'rendered'), { recursive: true });
for (const name of Object.keys(pages)) {
  const { default: Page, metadata } = await import(new URL(`../.build/${name}.mjs`, import.meta.url));
  const { body, head } = render(Page);
  const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${metadata.title.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</title>${head}</head><body>${body}</body></html>\n`;
  await fs.writeFile(path.join(root, `rendered/${name}.html`), html);
  console.log(`Rendered ${name}: ${body.length} characters`);
}
