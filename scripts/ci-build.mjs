import { appendFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
const logFile = resolve(workspace, '.ci-build.log');
writeFileSync(logFile, `Quid CI validation\nStarted: ${new Date().toISOString()}\n`, 'utf8');

const commands = [
  { name: 'Production build', command: 'npm', args: ['run', 'build'] },
  { name: 'Search Console QA', command: 'npm', args: ['run', 'seo:check'] },
];

for (const step of commands) {
  appendFileSync(logFile, `\n===== ${step.name} =====\n$ ${step.command} ${step.args.join(' ')}\n`, 'utf8');
  const result = spawnSync(step.command, step.args, {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  appendFileSync(logFile, result.stdout || '', 'utf8');
  appendFileSync(logFile, result.stderr || '', 'utf8');
  appendFileSync(logFile, `\nExit code: ${result.status ?? 'unknown'}\n`, 'utf8');

  if (result.error || result.status !== 0) {
    console.error(`${step.name} failed. Review the pull-request diagnostic comment or download the quid-ci-diagnostics artifact.`);
    process.exit(result.status || 1);
  }
}

appendFileSync(logFile, `\nCompleted: ${new Date().toISOString()}\n`, 'utf8');
console.log('Production build and Search Console QA completed successfully.');
