import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist-pages');
const html = readFileSync(resolve(output, 'index.html'), 'utf8');
const requested = process.env.PAGES_BASE_PATH ?? '/';
const base = '/' + requested.replace(/^\/+|\/+$/g, '') + '/';
const prefix = base === '//' ? '/' : base;
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  assert.ok(match[1].startsWith(prefix), `Ruta fuera de la base: ${match[1]}`);
  assert.ok(existsSync(resolve(output, match[1].slice(prefix.length))), match[1]);
}
for (const name of ['app/site-data.ts','app/home-stage.tsx','app/portfolio-app.tsx']) {
  const source = readFileSync(resolve(root, name), 'utf8');
  for (const [,path] of source.matchAll(/publicAsset\("(\/[^"\n]+)"\)/g)) {
    assert.ok(existsSync(resolve(output, path.slice(1))), path);
  }
}
for (const inventory of ['recursos-septiembre-2026.json','recursos-septiembre-29.json','recursos-septiembre-30.json','recursos-septiembre-30-ajustes.json','recursos-octubre-01.json']) {
  for (const entry of JSON.parse(readFileSync(resolve(root, 'docs', inventory)))) {
    assert.equal(statSync(resolve(output, entry.path.slice(1))).size, entry.size, entry.path);
  }
}
assert.equal(readFileSync(resolve(output,'assets/documents/Cristian_David_Campos_CV.pdf')).subarray(0,4).toString(),'%PDF');
assert.ok(!existsSync(resolve(output,'worker')));
writeFileSync(resolve(output,'.nojekyll'),'');
console.log(`GitHub Pages: HTML, recursos, CV y base ${prefix} verificados. Salida estática: dist-pages/`);
