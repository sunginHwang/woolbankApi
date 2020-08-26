import path from 'path';

export const getExtensionName = (fileName: string): string => {
    const lastDotIndex = fileName.indexOf('.');
    return fileName.substring(lastDotIndex + 1, fileName.length);
}

export const getRootPath = ():string => {
    // @ts-ignore
    return path.dirname(require.main.filename || process.mainModule.filename);
}
