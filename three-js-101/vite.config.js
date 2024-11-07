// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    publicDir: '../static/',
    build: {
        rollupOptions: {
            input: {
                main: resolve('index.html'),
                shadows: resolve('shadows/index.html'),
                lights: resolve('lights/index.html'),
                materials: resolve('materials/index.html'),
                textures: resolve('textures/index.html'),
                cameras: resolve('cameras/index.html'),
                animations: resolve('animations/index.html'),
                transformations: resolve('transformations/index.html'),
            },
        },
    },
})