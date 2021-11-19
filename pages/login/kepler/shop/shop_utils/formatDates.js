/*
 * @Author: wuazhu
 * @Date: 2021-07-29 14:25:26
 * @LastEditTime: 2021-07-29 14:31:07
 */

export function formatDate (date, sep = '-') {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join(sep)
}

/**
 * 日期计算 dateAdd功能
 * @param {String} interval - 要添加的时间间隔.
 * @param {Number} number   - 要添加的时间间隔的个数
 * @param {Date} originDate - 时间对象
 * return 新的时间对象
 */
export function addDate (interval = 'd', number, originDate = new Date()) {
  const date = new Date(originDate.getTime());
  switch (interval) {
  case 'y':
    date.setFullYear(date.getFullYear() + number);
    return date;
  case 'q':
    date.setMonth(date.getMonth() + number * 3);
    return date;
  case 'm':
    date.setMonth(date.getMonth() + number);
    return date;
  case 'w':
    date.setDate(date.getDate() + number * 7);
    return date;
  case 'd':
    date.setDate(date.getDate() + number);
    return date;
  case 'h':
    date.setHours(date.getHours() + number);
    return date;
  case 'min':
    date.setMinutes(date.getMinutes() + number);
    return date;
  case 's':
    date.setSeconds(date.getSeconds() + number);
    return date;
  default:
    date.setDate(date.getDate() + number);
    return date;
  }
}

// 日期格式化
export function formatTime (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 如果是 1 位则前一位加0
 * @param { Number} n
 * @returns String
 */

function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}