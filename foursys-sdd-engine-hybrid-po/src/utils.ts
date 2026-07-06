import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export function getMcpConfigPath(): string {
    if (process.platform === 'win32') {
        return path.join(process.env['APPDATA'] || path.join(os.homedir(), 'AppData', 'Roaming'), 'Code', 'User', 'mcp.json');
    }
    if (process.platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'mcp.json');
    }
    return path.join(os.homedir(), '.config', 'Code', 'User', 'mcp.json');
}

export function checkFigmaMcpConfigured(): boolean {
    try {
        const p = getMcpConfigPath();
        if (!fs.existsSync(p)) { return false; }
        const cfg = JSON.parse(fs.readFileSync(p, 'utf-8'));
        return !!cfg?.servers?.figmaRemoteMcp;
    } catch { return false; }
}
