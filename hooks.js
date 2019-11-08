import { useState } from 'react';

// 给耗时任务添加loading状态

export function useLoading(task) {
  if (!(task instanceof Function)) {
    // 传入的不是函数
    throw new Error('the task you applied is not a function, please check!');
  }
  // 记录任务状态
  const [loading, setLoading] = useState(false);
  // 包装之后的任务
  const wrappedTask = (...rest) => {
    setLoading(true);
    const funcRet = task.call(this, ...rest);
    // 传入的是Promise类型函数
    if (funcRet instanceof Promise) {
      return new Promise((resolve, reject) => {
        funcRet
          .then(ret => {
            setLoading(false);
            resolve(ret);
          })
          .catch(err => {
            setLoading(false);
            reject(err);
          });
      });
    }
    // 非Promise类型函数，直接将执行结果返回
    setLoading(false);
    return funcRet;
  };
  return [loading, wrappedTask];
}
