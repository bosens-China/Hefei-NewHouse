import { type List } from '../../database';
import { getList } from './list';
import { getListDetails } from './listDetails';

export const getListResults = async (page = 1) => {
  const { total, values } = await getList(page);
  const arr = await Promise.all(
    values.map(async (f) => {
      return await getListDetails(f.url).then(async (data): Promise<List> => {
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
