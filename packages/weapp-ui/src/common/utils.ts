
import { ReturnType, FileType } from '../../types/utils'

function objectToString (style: object | string): string {
  if (style && typeof style === 'object') {
    let styleStr = ''
    Object.keys(style).forEach(key => {
      const lowerCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      styleStr += `${lowerCaseKey}:${style[key]};`
    })
    return styleStr
  } else if (style && typeof style === 'string') {
    return style
  }
  return ''
}

function pxTransform (size: number): string {
  if (!size) return ''
  const designWidth = 750
  const deviceRatio = {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  }
  return `${size / deviceRatio[designWidth]}rpx`
}

/**
 * 合并 style
 * @param {Object|String} style1
 * @param {Object|String} style2
 * @returns {String}
 */
function mergeStyle (
  style1: object | string,
  style2: object | string
): object | string {
  if (
    style1 &&
    typeof style1 === 'object' &&
    style2 &&
    typeof style2 === 'object'
  ) {
    return Object.assign({}, style1, style2)
  }
  return objectToString(style1) + objectToString(style2)
}

/**
 * @desc 校验文件格式
 * @param str
 * @param returnType
 * @param fileType
 */

 function checkFileType (str: string, returnType: keyof ReturnType = 'boolean', fileType: keyof FileType = 'img'): boolean | string {
   const typeToRegExp = {
     img: new RegExp(/\.(jpeg|png|jpg)$/, 'i'),
     video: new RegExp(/\.(rm|rmvb|mpeg-1|mpeg-2|mpeg-3|mpeg-4|mov|mtv|dat|wmv|avi|3gp|amv|dmv|flv|mpg|mpe|mpa|m15|m1v|mp2|mp4)$/, 'i'),
     audio: new RegExp(/\.(CD|mp3|MIDI|AAC|FLAC|APE|AMR|AIFF|WAVE)$/, 'i'),
     word: new RegExp(/\.(doc|docx)$/, 'i'),
     excel: new RegExp(/\.(xls|xlsx)$/, 'i'),
     ppt: new RegExp(/\.(ppt|pptx)$/, 'i'),
     pdf: new RegExp(/\.(pdf)$/, 'i'),
     gif: new RegExp(/\.(gif)$/, 'i')
   }
   if (returnType === 'boolean') {
     if (Object.keys(typeToRegExp).indexOf(fileType) > -1) {
       return typeToRegExp[fileType].test(str)
     }
     return 'unknown'
   }
   return Object.keys(typeToRegExp).find(v => typeToRegExp[v].test(str)) || 'unknown'
 }

 /**
  * @desc 获取文件后缀名
  * @param str
  */
function getFileSuffix (str: string): string {
   return str.substring(str.lastIndexOf('.') + 1)
 }


export {
  pxTransform,
  mergeStyle,
  checkFileType,
  getFileSuffix
}
