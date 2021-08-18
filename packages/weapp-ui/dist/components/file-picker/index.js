import React, { Fragment } from 'react';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { View, Image } from '@tarojs/components';
import { UtilsFile } from '@manniu/utils';
import { IS_WEAPP, IS_WEB, IS_ALIPAY } from '../../env/env';
import MnIcon from '../icon';
import MnActionSheet from '../action-sheet';
import MnActionSheetItem from '../action-sheet/body/item';
import Audio from './icon/audio.png';
import Video from './icon/video.png';
import Delete from './icon/delete.png';
import Excel from './icon/excel.png';
import Gif from './icon/gif.png';
import PDF from './icon/pdf.png';
import PPT from './icon/ppt.png';
import Txt from './icon/txt.png';
import Unknown from './icon/unknown.png';
import Word from './icon/word.png';
import Zip from './icon/zip.png';
const fileTypeIcon = {
    'audio': Audio,
    'video': Video,
    'gif': Gif,
    'pdf': PDF,
    'ppt': PPT,
    'txt': Txt,
    'unknown': Unknown,
    'word': Word,
    'zip': Zip,
    'excel': Excel,
};
// 生成 jsx 二维矩阵
const generateMatrix = (files, col, showAdd) => {
    files.forEach(v => {
        v.fileType = UtilsFile.checkFileType(v.url, 'type');
        v.suffix = UtilsFile.getFileSuffix(v.url);
    });
    const matrix = [];
    const length = showAdd ? files.length + 1 : files.length;
    const row = Math.ceil(length / col);
    for (let i = 0; i < row; i++) {
        if (i === row - 1) {
            // 最后一行数据加上添加按钮
            const lastArr = files.slice(i * col);
            if (lastArr.length < col) {
                if (showAdd) {
                    lastArr.push({ type: 'btn' });
                }
                // 填补剩下的空列
                for (let j = lastArr.length; j < col; j++) {
                    lastArr.push({ type: 'blank' });
                }
            }
            matrix.push(lastArr);
        }
        else {
            matrix.push(files.slice(i * col, (i + 1) * col));
        }
    }
    return matrix;
};
/**
 * @desc 判断字符串长度，显示省略号
 * @param str
 * @param nameLength
 * @returns
 */
const filterStr = (str, nameLength) => {
    // jpg, png, jpeg, mp4, mp3, avi,
    // 最多容纳 nameLength 个字符加四个 .  的长度
    if (typeof str === 'string' && str.length > nameLength) {
        const arr = str.split('.');
        const suffixLen = arr[arr.length - 1].length; // 后缀的长度
        return `${arr[0].substring(0, nameLength - suffixLen)}....${arr[arr.length - 1]}`;
    }
    return str;
};
export default class MnFilePicker extends React.Component {
    constructor(props) {
        super(props);
        /**
         * @desc 控制ActionSheet显示隐藏
         * @param status
         */
        this.setIsOpened = (status) => {
            this.setState({
                isOpened: status
            });
        };
        /**
         * @desc 选择文件
         * @param type
         */
        this.chooseFile = (type) => {
            const { multiple, count, sizeType, size = 50 } = this.props;
            const maxSize = size * 1024 * 1024;
            const filePathName = IS_ALIPAY ? 'apFilePaths' : 'tempFiles';
            const params = {};
            let _chooseFile = Taro.chooseImage;
            this.setState({
                isOpened: false
            });
            /* 是否多选，默认最大99 */
            if (multiple) {
                params.count = 99;
            }
            /* 是否指定单次选择最大文件数 */
            if (count) {
                params.count = count;
            }
            /**
             * 所选图片尺寸
             * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html#%E5%8F%82%E6%95%B0
             */
            if (sizeType) {
                params.sizeType = sizeType;
            }
            if (type === 'chat') {
                Taro.showToast({
                    title: `最多选择${count}个文件`,
                    icon: 'none'
                });
                _chooseFile = Taro.chooseMessageFile;
            }
            if (type === 'album' || type === 'camera') {
                if (type === 'album') {
                    Taro.showToast({
                        title: `最多选择${count}张照片`,
                        icon: 'none'
                    });
                }
                params.sourceType = [type];
                _chooseFile = Taro.chooseImage;
            }
            _chooseFile(params).then(res => {
                const newFiles = [];
                const fileIsTooLarge = [];
                Array.isArray(res[filePathName]) && res[filePathName].forEach(v => {
                    if (v.size <= maxSize) {
                        const fileObj = {
                            path: v.path,
                            size: v.size,
                            name: v.path.substr(v.path.lastIndexOf('/') + 1)
                        };
                        if (IS_WEB) {
                            fileObj.originalFileObj = v.originalFileObj;
                        }
                        newFiles.push(fileObj);
                    }
                    else {
                        fileIsTooLarge.length++;
                    }
                });
                if (fileIsTooLarge.length > 0) {
                    Taro.showToast({
                        title: fileIsTooLarge.length > 1 ? '部分文件大小超过50MB，无法上传' : '文件大小超过50MB，无法上传',
                        icon: 'none'
                    });
                }
                this.props.onAdd && this.props.onAdd(newFiles);
            }).catch(err => {
                this.props.onFail && this.props.onFail(err);
            });
        };
        /**
         * @desc 点击文件
         * @param idx - 文件下标
         * @param file
         */
        this.handleFileClick = (idx, file) => {
            this.props.onFileClick && this.props.onFileClick(idx, file);
        };
        /**
         * @desc 移除文件
         * @param idx - files数组中当前文件下标
         * @param event
         */
        this.handleRemove = (idx, event) => {
            const { files } = this.props;
            event.stopPropagation();
            event.preventDefault();
            if (IS_WEB) {
                window.URL.revokeObjectURL(files[idx].url);
            }
            this.props.onRemove && this.props.onRemove(idx);
        };
        this.state = {
            isOpened: false
        };
    }
    render() {
        const { files, className, fileType = ['chat', 'camera', 'album'], action = '', imageMode = 'aspectFill', length = 4, showAdd = false, showName = false, spacing = 16, showRemove = false } = this.props;
        const { isOpened } = this.state;
        let title = '';
        if (IS_WEAPP) {
            title = '*注意：文件选取微信聊天记录中的文件';
        }
        const rowLength = length <= 0 ? 1 : length;
        // 行数
        const matrix = generateMatrix(files, rowLength, showAdd);
        const rootCls = classNames('mn-image-picker', className);
        return (React.createElement(View, { className: rootCls }, matrix.length > 0 || showAdd ?
            React.createElement(Fragment, null,
                Array.isArray(matrix) && matrix.map((row, index) => (React.createElement(View, { className: `mn-file-picker__flex-box ${showName ? 'p-t-20' : ''}`, style: { marginBottom: showName ? `${spacing * 2}px` : `${spacing}px` }, key: index + 1 }, row.map((v, i) => (v.url ? (React.createElement(View, { style: { marginLeft: i === 0 ? '' : `${spacing / 2}px`, marginRight: i < length - 1 ? `${spacing / 2}px` : '' }, className: 'mn-file-picker__flex-item', onClick: () => this.handleFileClick((index * length) + i, v), key: (index * length) + i },
                    React.createElement(View, { className: 'mn-file-picker__item' },
                        showRemove && (React.createElement(View, { className: 'mn-file-picker__remove-btn', onClick: (e) => this.handleRemove((index * length) + i, e) },
                            React.createElement(Image, { className: 'icon-remove', src: Delete }))),
                        v.fileType === 'img' ?
                            React.createElement(Image, { className: 'mn-file-picker__preview-img', mode: imageMode, src: action + v.url })
                            :
                                React.createElement(Image, { className: 'icon-file-type', src: fileTypeIcon[v.fileType] })))) : (React.createElement(View, { style: { marginLeft: i > 0 && i < length - 1 ? `${spacing}px` : '', marginRight: i > 0 && i < length - 1 ? `${spacing}px` : '' }, className: 'mn-file-picker__flex-item', key: `empty_${index * length}${i}` }, v.type === 'btn' && (React.createElement(View, { className: 'mn-file-picker__item mn-file-picker__choose-btn', onClick: () => this.setIsOpened(true) },
                    React.createElement(MnIcon, { value: 'add', size: '40', color: 'white' })))))))))),
                React.createElement(MnActionSheet, { isOpened: isOpened, title: title, cancelText: '\u53D6\u6D88', onClose: () => this.setIsOpened(false) },
                    (IS_WEAPP && fileType.indexOf('chat') > -1) && React.createElement(MnActionSheetItem, { onClick: () => this.chooseFile('chat') }, "\u6587\u4EF6"),
                    fileType.indexOf('camera') > -1 && React.createElement(MnActionSheetItem, { onClick: () => this.chooseFile('camera') }, "\u62CD\u7167"),
                    fileType.indexOf('album') > -1 && React.createElement(MnActionSheetItem, { onClick: () => this.chooseFile('album') }, "\u4ECE\u76F8\u518C\u9009\u53D6")))
            :
                React.createElement(View, { className: 'no-data' }, "\u6682\u65E0")));
    }
}
MnFilePicker.defaultProps = {
    files: [],
    action: '',
    imageMode: 'aspectFill',
    length: 4,
    multiple: false,
    showAdd: false,
    showName: false,
    spacing: 16,
    nameLength: 8,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    count: 50,
    size: 50,
    fileType: ['chat', 'camera', 'album'],
    showRemove: false,
    onAdd: () => { },
    onRemove: () => { },
    onFileClick: () => { },
    onFail: () => { }
};
MnFilePicker.propTypes = {
    /**
     * 文件数组对象，元素为对象，包含url（必选））
     */
    files: PropTypes.array,
    /**
     * OSS服务地址
     */
    action: PropTypes.string,
    /**
     * 图片显示mode，对应 Image 标签的 mode 属性
     */
    imageMode: PropTypes.oneOf([
        'scaleToFill',
        'aspectFit',
        'aspectFill',
        'widthFix',
        'top',
        'bottom',
        'center',
        'left',
        'right',
        'top left',
        'top right',
        'bottom left',
        'bottom right'
    ]),
    /**
     * 是否显示文件名称
     * @default false
     */
    showName: PropTypes.bool,
    /**
     * 是否显示添加图片按钮
     * @default true
     */
    showAdd: PropTypes.bool,
    /**
     * 是否支持多选
     * @default false
     */
    multiple: PropTypes.bool,
    /**
     * 单行的图片数量，不能为 0 或负数
     * @default 4
     */
    length: PropTypes.number,
    /**
     * 最多可以选择的图片张数
     * @since v2.0.2
     */
    count: PropTypes.number,
    /**
     * 所选的图片的尺寸
     * @since v2.0.2
     */
    sizeType: PropTypes.array,
    /**
     * 选择图片的来源
     * @since v2.0.2
     */
    sourceType: PropTypes.array,
    /**
     * 可选类型，支持聊天记录选择文件，相册选择，拍照上传
     * @default ['chat', ' camera', 'album']
     */
    fileType: PropTypes.array,
    /**
     * 是否显示删除按钮
     */
    showRemove: PropTypes.bool,
    /**
     * 最大上传文件，单位: MB
     */
    size: PropTypes.number,
    /**
     * 列间距
     */
    spacing: PropTypes.number,
    /**
     * files 值发生变化触发的回调函数
     */
    onAdd: PropTypes.func,
    /**
     * 移除文件
     */
    onRemove: PropTypes.func,
    /**
     * 点击文件触发回调
     */
    onFileClick: PropTypes.func,
    /**
     * 选择失败触发的回调
     * @param msg
     */
    onFail: PropTypes.func,
};
//# sourceMappingURL=index.js.map