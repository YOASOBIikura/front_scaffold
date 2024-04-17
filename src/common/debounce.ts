// 防抖 fn: 高频事件 wait: 延迟时间 immediate： 是否立即执行
// export const Debounce = (fn: Function, wait: number, immediate: boolean = false) => {
//     let timer: any, startTimeStamp = 0;
//     let context: Function, args: any;
  
//     let run = (timerInterval: number)=>{
//         timer= setTimeout(()=>{
//             let now = (new Date()).getTime();
//             let interval = now - startTimeStamp
//             if(interval < timerInterval){ // the timer start time has been reset，so the interval is less than timerInterval
//                 // console.log('debounce reset',timerInterval - interval);
//                 startTimeStamp = now;
//                 run(wait - interval);  // reset timer for left time
//             }else{
//                 if(!immediate){
//                     fn.apply(context,args);
//                 }
//                 clearTimeout(timer);
//                 timer = null;
//             }
             
//         },timerInterval);
//     }
  
//     return function(this: any) {
//         context = this;
//         args = arguments;
//         let now = (new Date()).getTime();
//         startTimeStamp = now; // set timer start time
  
//         if(!timer){
//             // console.log('debounce set', wait);
//             if(immediate) {
//                 fn.apply(context, args);
//             }
//             run(wait);    // last timer alreay executed, set a new timer
//         }
//     }
// }

export const Debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number,
    immediate: boolean = false
  ): T => {
    let timeout: any;
  
    return function (this: any, ...args: any[]) {
      const context = this;
  
      const later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
  
      const callNow = immediate && !timeout;
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
  
      if (callNow) {
        func.apply(context, args);
      }
    } as T;
  };

// // 节流 fn: 高频事件 wait: 延迟事件 immediate： 是否立即执行
// export const Throttling = (fn: Function, wait: number, immediate: boolean = false) => {
//     let timer: any;
//     let context: Function, args: any;
  
//     let run = () => {
//         timer=setTimeout(()=>{
//             if(!immediate){
//                 fn.apply(context,args);
//             }
//             clearTimeout(timer);
//             timer=null;
//         },wait);
//     }
//     return function (this: any) {
//         context = this;
//         args=arguments;
//         if(!timer){
//             // console.log("throttle, set");
//             if(immediate){
//                 fn.apply(context,args);
//             }
//             run();
//         }else{
//             // console.log("throttle, ignore");
//         }
//     }
  
// }

export const Throttling = <T extends (...args: any[]) => void>(
    func: T,
    wait: number,
    immediate: boolean = false
  ): T => {
    let timeout: any;
    let previous = 0;
  
    return function (this: any, ...args: any[]) {
      const context = this;
      const now = Date.now();
      const remaining = wait - (now - previous);
  
      if (remaining <= 0) {
        clearTimeout(timeout);
        func.apply(context, args);
        previous = now;
      } else if (!timeout) {
        if (immediate) {
          func.apply(context, args);
        }
        timeout = setTimeout(() => {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
          previous = Date.now();
        }, remaining);
      }
    } as T;
  };