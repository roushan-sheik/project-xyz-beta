/**
 * Delay the execution of the next line of code
 * @param miliseconds
 */
const delay = (miliseconds: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, miliseconds);
  });
};

export default delay;
