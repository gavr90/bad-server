import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join, extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
// eslint-disable-next-line import/named
import { FILE_SIZE, ALLOWED_IMAGE_TYPES } from '../config'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const uploadDir = join(
    __dirname,
    process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public'
)

fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(null, uploadDir)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, uuidv4() + extname(file.originalname))
    },
})

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

export default multer({ storage, fileFilter, limits: {
    // Limit max file size to 10MB
    fileSize: FILE_SIZE.max
} })
