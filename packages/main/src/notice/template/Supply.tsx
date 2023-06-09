interface Props {
  total: number;
  region: string;
}

export const Supply = (item: Props) => {
  return (
    <>
      <p>刚需供应数：{Math.ceil(item.total * 0.3)}</p>
      {['高新区', '经济区'].includes(item.region) ? <p>职住平衡供应数：{Math.ceil(item.total * 0.5)}</p> : null}
    </>
  );
};
