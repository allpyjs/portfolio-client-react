import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import child_process from 'child_process';
import { env } from 'process';
import path from 'path';

// Set the certificate folder path relative to the current working directory
const certFolderPath = path.resolve(__dirname, 'C:\\Users\\dev\\asp.net');

// Define certificate file paths
const certFilePath = path.join(certFolderPath, 'monate.web.client.pem');
const keyFilePath = path.join(certFolderPath, 'monate.web.client.key');

// Check if certificate files exist, otherwise create them
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = "http://ec2-3-137-165-184.us-east-2.compute.amazonaws.com"
    // const target = env.ASPNETCORE_HTTPS_PORT ? `http://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    // env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:5000';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/user': {
                target,
                secure: false
            },
            '^/category': {
                target,
                secure: false
            },
            '^/portfolio': {
                target,
                secure: false
            },
            '^/endpoint': {
                target,
                secure: false
            },
            '^/valuetype': {
                target,
                secure: false
            },
            '^/workflow': {
                target,
                secure: false
            },
        },
        port: 5173,
        // https: {
        //     key: fs.readFileSync(keyFilePath),
        //     cert: fs.readFileSync(certFilePath),
        // }
    }
});
