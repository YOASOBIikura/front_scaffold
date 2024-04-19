/**
 * 将一个时间转换成日期
 * @param time 
 */
export const TimeTransformDate = (time: Date | string | number, split: string = ' ', isUTC: boolean = false) => {
    let monthEnglish = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let date = new Date(time);
    let hour = date.getHours()%12;
    let pm = date.getHours()/12 >= 1;
    if (isUTC) {
      hour = date.getUTCHours()%12;
      pm = date.getUTCHours()/12 >= 1;
    }
    if (pm && hour === 0) {
      hour = 12;
    }
    if (isUTC) {
      return date.getUTCDate() + split + monthEnglish[date.getUTCMonth()] + split + (date.getUTCFullYear()).toString().substring(2) + split + hour + (pm?'PM':'AM');
      
    }
    return date.getDate() + split + monthEnglish[date.getMonth()] + split + (date.getFullYear()).toString().substring(2) + split + hour + (pm?'PM':'AM');
  }
  
  /**
   * 将一个时间转换成日期 不带小时
   * @param time 
   */
  export const TimeTransformDateWithoutHour = (time: Date | string | number, split: string = ' ', isUTC: boolean = false) => {
    let monthEnglish = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let date = new Date(time);
    if(isUTC) {
      return date.getUTCDate() + split + monthEnglish[date.getUTCMonth()] + split + (date.getUTCFullYear()).toString().substring(2);
    }
    return date.getDate() + split + monthEnglish[date.getMonth()] + split + (date.getFullYear()).toString().substring(2);
  }