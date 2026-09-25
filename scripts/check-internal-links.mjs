import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'dist');
const missing = [];
let checkedReferences = 0;

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

async function exists(candidate) {
  try {
    const stat = await fs.stat(candidate);
    return stat.isFile();
  } catch {
    return false;
  }
}

function decodeReference(reference) {
  return reference.replaceAll('&amp;', '&').replaceAll('&#38;', '&');
}

function isIgnored(reference) {
  return (
    reference === '' ||
    reference.startsWith('#') ||
    reference.startsWith('//') ||
    /^[a-z][a-z\d+.-]*:/i.test(reference)
  );
}

async function validateReference(reference, sourceFile) {
  const decoded = decodeReference(reference.trim());
  if (isIgnored(decoded)) return;

  const withoutFragment = decoded.split('#', 1)[0];
  const withoutQuery = withoutFragment.split('?', 1)[0];
  if (!withoutQuery) return;

  let pathname;
  try {
    pathname = decodeURIComponent(withoutQuery);
  } catch {
    missing.push({ sourceFile, reference, reason: 'URL encoding is invalid' });
    return;
  }

  const target = pathname.startsWith('/')
    ? path.resolve(root, `.${pathname}`)
    : path.resolve(path.dirname(sourceFile), pathname);
  const relativeTarget = path.relative(root, target);

  if (relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget)) {
    missing.push({ sourceFile, reference, reason: 'target escapes dist' });
    return;
  }

  const candidates = [target];
  if (pathname.endsWith('/')) {
    candidates.push(path.join(target, 'index.html'));
  } else if (!path.extname(target)) {
    candidates.push(`${target}.html`, path.join(target, 'index.html'));
  } else {
    candidates.push(path.join(target, 'index.html'));
  }

  checkedReferences += 1;
  for (const candidate of candidates) {
    if (await exists(candidate)) return;
  }

  missing.push({ sourceFile, reference, reason: 'target does not exist' });
}

let files;
try {
  files = await collectFiles(root);
} catch (error) {
  console.error(`Cannot read build directory ${root}: ${error.message}`);
  process.exit(1);
}

const htmlFiles = files.filter((file) => file.endsWith('.html'));
for (const htmlFile of htmlFiles) {
  const html = await fs.readFile(htmlFile, 'utf8');
  const references = new Set();
  const attributePattern = /\b(?:href|src)\s*=\s*["']([^"'<>]+)["']/gi;
  const srcsetPattern = /\bsrcset\s*=\s*["']([^"'<>]+)["']/gi;

  for (const match of html.matchAll(attributePattern)) {
    references.add(match[1]);
  }

  for (const match of html.matchAll(srcsetPattern)) {
    for (const candidate of match[1].split(',')) {
      const reference = candidate.trim().split(/\s+/, 1)[0];
      if (reference) references.add(reference);
    }
  }

  for (const reference of references) {
    await validateReference(reference, htmlFile);
  }
}

if (missing.length > 0) {
  console.error(`Found ${missing.length} broken internal reference(s):`);
  for (const item of missing) {
    console.error(
      `- ${path.relative(root, item.sourceFile)} -> ${item.reference} (${item.reason})`
    );
  }
  process.exit(1);
}

console.log(
  `Validated ${checkedReferences} internal reference(s) across ${htmlFiles.length} HTML file(s).`
);
