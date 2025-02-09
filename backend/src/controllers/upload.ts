import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
// eslint-disable-next-line import/no-extraneous-dependencies
import { loadEsm } from 'load-esm'
import BadRequestError from '../errors/bad-request-error'
// eslint-disable-next-line import/named
import { FILE_SIZE, ALLOWED_IMAGE_TYPES } from '../config'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    if (req.file.size < FILE_SIZE.min) {
        return next(new BadRequestError('Файл слишком маленький'))
    }
    try {
        const { fileTypeFromFile } = await loadEsm<typeof import('file-type')>('file-type');    
        const fileType = await fileTypeFromFile(req.file.path);
        if (!fileType)
            return next(new BadRequestError('Неизвестный тип файла'))
        if (!fileType.mime)
            return next(new BadRequestError('Неизвестный тип файла'))
        if (!ALLOWED_IMAGE_TYPES.includes(fileType.mime))     
            return next(new BadRequestError('Недопустимый тип файла'))
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
