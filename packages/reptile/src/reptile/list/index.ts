import { type List, type ListProps } from '@new-house/data/list';
import { getList } from './list';

import { getListDetails } from './listDetails';

export const getListResults = async (page = 1) => {
  const { total, values } = await getList(page);
  return {
    total,
    values,
  };
};

// 添加详情
export const consolidationResultList = async (f: ListProps) => {
  return await getListDetails(f.url).then(async (data): Promise<List> => {
    return {
      ...f,
      ...data,
    };
  });
};
