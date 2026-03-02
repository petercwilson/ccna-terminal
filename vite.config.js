import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ccna-terminal/', // THIS IS THE KEY ADDITION
})
