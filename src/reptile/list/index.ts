import { getList } from './list.js';
import { getListDetails } from './listDetails.js';

export const getListResults = async (page = 1) => {
  const { total, values } = await getList(page);
  const arr = await Promise.all(
    values.map(async (f) => {
      return await getListDetails(f.url).then((data) => {
        return {
          ...f,
          ...data,
        };
      });
    }),
  );
  return {
    total,
    values: arr,
  };
};
