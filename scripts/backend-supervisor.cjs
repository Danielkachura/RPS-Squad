const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const logDir = path.join(root, "server-logs");
fs.mkdirSync(logDir, { recursive: true });

const python = path.join(process.env.LOCALAPPDATA, "Programs", "Python", "Python312", "python.exe");
const out = fs.createWriteStream(path.join(logDir, "backend-supervisor.out.log"), { flags: "a" });
const err = fs.createWriteStream(path.join(logDir, "backend-supervisor.err.log"), { flags: "a" });

const child = spawn(
  python,
  ["-m", "uvicorn", "backend.python_api.app:app", "--host", "127.0.0.1", "--port", "8000"],
  { cwd: root, windowsHide: true },
);

out.write(`backend child pid ${child.pid}\n`);
child.stdout.pipe(out);
child.stderr.pipe(err);
child.on("exit", (code, signal) => {
  err.write(`backend exited code=${code} signal=${signal}\n`);
  process.exit(code ?? 1);
});

process.on("SIGTERM", () => child.kill("SIGTERM"));
setInterval(() => undefined, 60_000);
