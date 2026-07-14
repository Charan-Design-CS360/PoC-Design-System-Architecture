import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

function filesUnder(path) {
  const absolute = join(root, path);
  return readdirSync(absolute).flatMap((name) => {
    const child = join(absolute, name);
    return statSync(child).isDirectory()
      ? filesUnder(relative(root, child))
      : [child];
  });
}
function source(path) {
  return readFileSync(path, 'utf8');
}

function withoutComments(value) {
  return value.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function tokens(value, expression) {
  return new Set([...value.matchAll(expression)].map((match) => match[1]));
}

const primitiveFiles = filesUnder('src/styles/1-primitives').filter((file) => file.endsWith('.scss'));
const activeSemanticFiles = [
  '_theme-light.scss',
  '_theme-dark.scss',
  '_density.scss',
  '_layout.scss',
  '_a11y.scss',
  '_status.scss'
].map((file) => join(root, 'src/styles/2-semantics', file));
const componentFiles = [
  ...filesUnder('src/styles/3-components').filter((file) => file.endsWith('.scss')),
  ...filesUnder('src/app').filter((file) => file.endsWith('.scss'))
];
const checkedStyleFiles = [
  ...filesUnder('src/styles/2-semantics').filter((file) => file.endsWith('.scss')),
  ...componentFiles,
  join(root, 'src/styles/styles.scss')
];
const activeFiles = [...primitiveFiles, ...activeSemanticFiles, ...componentFiles, join(root, 'src/styles/styles.scss')];
const failures = [];

for (const file of checkedStyleFiles) {
  const value = withoutComments(source(file));
  const checks = [
    ['hex color', /#[0-9a-f]{3,8}\b/i],
    ['raw pixel value', /(^|[^\w-])-?(?:\d+\.)?\d+px\b/m],
    ['!important', /!important\b/],
    ['module-prefixed token', /--(?:agency|stg|admin)-[\w-]+/]
  ];

  for (const [label, expression] of checks) {
    if (expression.test(value)) {
      failures.push(`${relative(root, file)} contains ${label}`);
    }
  }
}

for (const file of filesUnder('src/app').filter((entry) => entry.endsWith('.html'))) {
  if (/\sstyle\s*=/.test(source(file))) {
    failures.push(`${relative(root, file)} contains an inline style`);
  }
}

const definitionPattern = /(--[a-z0-9-]+)\s*:/gi;
const referencePattern = /var\(\s*(--[a-z0-9-]+)/gi;
const allDefinitions = tokens(activeFiles.map(source).join('\n'), definitionPattern);
const allReferences = tokens(activeFiles.map(source).join('\n'), referencePattern);

for (const token of allReferences) {
  if (!allDefinitions.has(token)) {
    failures.push(`active contract references undefined token ${token}`);
  }
}

const primitiveDefinitions = tokens(primitiveFiles.map(source).join('\n'), definitionPattern);
const semanticDefinitions = tokens(activeSemanticFiles.map(source).join('\n'), definitionPattern);
const componentReferences = tokens(componentFiles.map(source).join('\n'), referencePattern);

for (const token of componentReferences) {
  if (primitiveDefinitions.has(token) && !semanticDefinitions.has(token)) {
    failures.push(`Tier 3 reaches directly into primitive ${token}`);
  }
}

const lightTokens = tokens(source(activeSemanticFiles[0]), definitionPattern);
const darkTokens = tokens(source(activeSemanticFiles[1]), definitionPattern);
for (const token of new Set([...lightTokens, ...darkTokens])) {
  if (!lightTokens.has(token) || !darkTokens.has(token)) {
    failures.push(`theme contract is asymmetric for ${token}`);
  }
}

const densitySource = source(activeSemanticFiles[2]);
for (const mode of ['compact', 'default', 'comfortable']) {
  if (!densitySource.includes(`[data-density="${mode}"]`)) {
    failures.push(`density contract is missing ${mode}`);
  }
}

if (failures.length > 0) {
  console.error('Token contract failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Token contract passed: ${allDefinitions.size} definitions, ${componentReferences.size} Tier 3 references.`);
  console.log('Zero hex, raw px, !important, inline styles, module prefixes, undefined tokens, or theme gaps outside primitives.');
}
