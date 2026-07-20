import * as fs from 'fs';
import * as path from 'path';

export interface SDDSessionMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    tokens?: number;
    credits?: number;
    isError?: boolean;
}

export interface SDDSession {
    id: string;
    phase: string;
    storySlug?: string;
    title: string;
    stackId: string;
    createdAt: string;
    updatedAt: string;
    messages: SDDSessionMessage[];
    outputFiles: string[];
}

function sessionFilePath(sessionsRootDir: string, sessionId: string): string {
    return path.join(sessionsRootDir, `${sessionId}.json`);
}

function writeSession(sessionsRootDir: string, session: SDDSession): void {
    if (!fs.existsSync(sessionsRootDir)) { fs.mkdirSync(sessionsRootDir, { recursive: true }); }
    fs.writeFileSync(sessionFilePath(sessionsRootDir, session.id), JSON.stringify(session, null, 2), 'utf-8');
}

function makeSessionId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createSession(
    sessionsRootDir: string,
    params: { phase: string; storySlug?: string; stackId: string; title: string }
): SDDSession {
    const now = new Date().toISOString();
    const session: SDDSession = {
        id: makeSessionId(),
        phase: params.phase,
        storySlug: params.storySlug,
        title: params.title,
        stackId: params.stackId,
        createdAt: now,
        updatedAt: now,
        messages: [],
        outputFiles: []
    };
    writeSession(sessionsRootDir, session);
    return session;
}

export function loadSession(sessionsRootDir: string, sessionId: string): SDDSession | null {
    const filePath = sessionFilePath(sessionsRootDir, sessionId);
    if (!fs.existsSync(filePath)) { return null; }
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as SDDSession;
    } catch {
        return null;
    }
}

export function listSessions(
    sessionsRootDir: string,
    filter?: { storySlug?: string; phase?: string }
): SDDSession[] {
    if (!fs.existsSync(sessionsRootDir)) { return []; }
    const sessions: SDDSession[] = [];
    for (const entry of fs.readdirSync(sessionsRootDir, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.json')) { continue; }
        try {
            const session = JSON.parse(fs.readFileSync(path.join(sessionsRootDir, entry.name), 'utf-8')) as SDDSession;
            if (filter?.storySlug !== undefined && session.storySlug !== filter.storySlug) { continue; }
            if (filter?.phase !== undefined && session.phase !== filter.phase) { continue; }
            sessions.push(session);
        } catch { /* arquivo de sessão corrompido — ignora */ }
    }
    sessions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return sessions;
}

export function appendMessage(sessionsRootDir: string, sessionId: string, message: SDDSessionMessage): SDDSession {
    const session = loadSession(sessionsRootDir, sessionId);
    if (!session) { throw new Error(`Sessão não encontrada: ${sessionId}`); }
    session.messages.push(message);
    session.updatedAt = new Date().toISOString();
    writeSession(sessionsRootDir, session);
    return session;
}

export function recordOutputFile(sessionsRootDir: string, sessionId: string, relPath: string): SDDSession {
    const session = loadSession(sessionsRootDir, sessionId);
    if (!session) { throw new Error(`Sessão não encontrada: ${sessionId}`); }
    if (!session.outputFiles.includes(relPath)) {
        session.outputFiles.push(relPath);
    }
    session.updatedAt = new Date().toISOString();
    writeSession(sessionsRootDir, session);
    return session;
}
