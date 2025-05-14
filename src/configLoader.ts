// Utility to load configuration JSON from a public GitHub repository and cache it locally
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

const CONFIG_URL = 'https://raw.githubusercontent.com/<your-org-or-user>/<your-repo>/main/config/devtwin-config.json';
const CACHE_DIR = path.join(__dirname, '../../.devtwin-cache');
const CACHE_FILE = path.join(CACHE_DIR, 'devtwin-config.json');

export async function loadConfig(): Promise<any> {
    // Try to fetch from GitHub
    try {
        const res = await fetch(CONFIG_URL);
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        await cacheConfig(json);
        return json;
    } catch (err) {
        // Fallback to local cache
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, 'utf-8');
            return JSON.parse(data);
        } else {
            vscode.window.showErrorMessage('Failed to load configuration from GitHub and no local cache found.');
            throw err;
        }
    }
}

export async function cacheConfig(json: any) {
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR);
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(json, null, 2), 'utf-8');
}

export async function refreshConfig(): Promise<any> {
    // Force reload from GitHub
    try {
        const res = await fetch(CONFIG_URL);
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        await cacheConfig(json);
        vscode.window.showInformationMessage('DevTwin config refreshed from GitHub.');
        return json;
    } catch (err) {
        vscode.window.showErrorMessage('Failed to refresh configuration from GitHub.');
        throw err;
    }
}
