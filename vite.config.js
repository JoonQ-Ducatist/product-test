import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 로컬 개발은 루트 경로를, GitHub Pages는 현재 저장소 이름의 하위 경로를 사용한다.
  base: process.env.VITE_BASE_PATH ?? '/',
});
