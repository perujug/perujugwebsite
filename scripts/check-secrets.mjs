import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';

const patterns = [
  { name: 'Google API key', pattern: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'AWS access key ID', pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  { name: 'GitHub token', pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{40,255})\b/ },
  { name: 'Slack token', pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/ },
  { name: 'private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
];

const trackedFiles = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'buffer', maxBuffer: 10 * 1024 * 1024 }
)
  .toString('utf8')
  .split('\0')
  .filter(Boolean);

const findings = [];
for (const file of trackedFiles) {
  let content;
  try {
    const buffer = await fs.readFile(file);
    if (buffer.length > 1024 * 1024 || buffer.includes(0)) continue;
    content = buffer.toString('utf8');
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    findings.push({ file, name: `unreadable file: ${error.message}` });
    continue;
  }

  for (const { name, pattern } of patterns) {
    if (pattern.test(content)) findings.push({ file, name });
  }
}

if (findings.length > 0) {
  console.error(`Found ${findings.length} possible secret(s) in tracked files:`);
  for (const { file, name } of findings) {
    console.error(`- ${file}: ${name}`);
  }
  console.error('Detected values are intentionally not printed.');
  process.exit(1);
}

console.log(`Scanned ${trackedFiles.length} tracked file(s); no high-confidence secrets found.`);
