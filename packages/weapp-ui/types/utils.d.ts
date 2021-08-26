
export interface File {
  /**
   * 获取文件分类，返回 'img' | 'video' | 'audio' | 'file'
   * @param str
   * @param type
   */
  checkFileType: (str: string, returnType: keyof ReturnType, fileType?: keyof FileType) => boolean | string

  /**
   * 获取文件后缀名
   * @param str
   */
  getFileSuffix: (str: string) => string
}

export interface ReturnType {
  /* 返回类型：audio | img | video等 */
  type
  /* 返回 true | false，此时需要传入type */
  boolean
}

export interface FileType {
  /* 图片 */
  img
  /* 视频 */
  video
  /* 音频 */
  audio
  /* 表格 */
  excel
  /* word */
  word
  /* ppt */
  ppt
  /* pdf */
  pdf
}
