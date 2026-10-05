import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({base:'./',plugins:[react()],resolve:{preserveSymlinks:true,alias:{'@':fileURLToPath(new URL('.',import.meta.url))}},server:{host:'127.0.0.1'},build:{outDir:'dist'}});
