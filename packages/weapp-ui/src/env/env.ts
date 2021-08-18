import Taro from '@tarojs/taro'
const ENV = Taro.getEnv()

export const IS_WEAPP = ENV === Taro.ENV_TYPE.WEAPP

export const IS_WEB = ENV === Taro.ENV_TYPE.WEB

export const IS_ALIPAY = ENV === Taro.ENV_TYPE.ALIPAY

