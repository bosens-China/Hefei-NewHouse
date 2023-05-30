export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const extension = async <T extends (...rest: any[]) => any>(
  fn: T,
  time = randomNumber(4000, 10000),
): Promise<ReturnType<T>> => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, time);
  });
};
