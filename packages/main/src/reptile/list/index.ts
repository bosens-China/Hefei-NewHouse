import { type List } from '../../database/list';
import { getList, type Props } from './list';
import { getListDetails } from './listDetails';

export const getListResults = async (page = 1) => {
  const { total, values } = await getList(page);
  return {
    total,
    values,
  };
};

// 添加详情
export const consolidationResultList = async (f: Props) => {
  return await getListDetails(f.url).then(async (data): Promise<List> => {
    return {
      ...f,
      ...data,
    };
  });
};
