import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerCategoryImageOptions = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = extname(file.originalname);
            // cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            cb(null, `${file.originalname.split('.')[0]}-${uniqueSuffix}${ext}`);
        },
    }),
};


