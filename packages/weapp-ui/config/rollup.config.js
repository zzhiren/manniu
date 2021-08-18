import NodePath from 'path'
import RollupJson from '@rollup/plugin-json'
import RollupNodeResolve from '@rollup/plugin-node-resolve'
import RollupCommonjs from '@rollup/plugin-commonjs'
import RollupTypescript from 'rollup-plugin-typescript2'
import RollupCopy from 'rollup-plugin-copy'
import Package from '../package.json'

const resolveFile = path => NodePath.resolve(__dirname, '..', path)

const externalPackages = [
  'react',
  'react-dom',
  'taro-ui',
  '@tarojs/components',
  '@tarojs/runtime',
  '@tarojs/taro',
  '@tarojs/react'
]

export default {
  input: resolveFile(Package.source),
  output: [
    {
      file: resolveFile(Package.main),
      format: 'cjs',
      sourcemap: true
    },
    {
      file: resolveFile(Package.module),
      format: 'es',
      sourcemap: true
    }
  ],
  external: externalPackages,
  plugins: [
    /* 路径引入方式，使用后引入模块可以忽略 index.js */
    RollupNodeResolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    /* 将 commonjs 模块转换成 ES5 ES6 */
    RollupCommonjs({
      include: /\/node_modules\//
    }),
    /* 将 json 文件转换成 ES6模块 */
    RollupJson(),
    RollupTypescript({
      tsconfig: resolveFile('tsconfig.rollup.json')
    }),
    RollupCopy({
      targets: [
        {
          src: resolveFile('src/style'),
          dest: resolveFile('dist')
        },
        {
          src: resolveFile('src/components/file-picker/icon'),
          dest: resolveFile('dist/components/file-picker')
        },
        {
          src: resolveFile('types'),
          dest: resolveFile('dist')
        }
      ]
    })
  ]
}
