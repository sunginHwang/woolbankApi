import { AccountBookCategoryImage } from '../entity/AccountBookCategoryImage';

export const getAccountBookCategoryImages = async () => {
  return await AccountBookCategoryImage.find({
    order: { id: 'DESC' },
  });
};
