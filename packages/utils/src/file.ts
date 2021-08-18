/**
 * @desc 校验文件格式
 * @param str
 * @param type
 */
import { ReturnType, FileType } from '../types/file'

export function checkFileType (str: string, returnType: keyof ReturnType = 'boolean', fileType: keyof FileType = 'img'): boolean | string {
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
export function getFileSuffix (str: string): string {
  return str.substring(str.lastIndexOf('.') + 1)
}
