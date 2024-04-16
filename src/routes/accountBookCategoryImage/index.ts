import Router from '@koa/router';
import {
    getAccountBookCategoryImages,
} from '../../service/accountBookCategoryImageService';
import {  resOK } from '../../utils/common';
import isAuthenticated from '../../middleware/isAuthenticated';

const router = new Router();

router.get('/', isAuthenticated, async (ctx) => {

  const accountBookCategoryImages = await getAccountBookCategoryImages();
  return resOK(ctx, accountBookCategoryImages ? accountBookCategoryImages : []);
});

export default router;
