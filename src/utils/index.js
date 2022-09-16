// 定义设计稿的宽高
const designWidth = 1920;
const designHeight = 1080;

export const styleUtil = {
  // px转vw
  px2vw(_px) {
    return `${(_px * 100.0) / designWidth}vw`;
  },
  // px转vh
  px2vh(_px) {
    return `${(_px * 100.0) / designHeight}vh`;
  },
};

export const echartMapPx = {
  mapWidth(px) {
    const { clientWidth } = document.documentElement;
    return px * (clientWidth / designWidth);
  },
  mapHeight(px) {
    const { clientHeight } = document.documentElement;
    return px * (clientHeight / designHeight);
  },
};

export const isNumber = (num) => Object.prototype.toString.call(num) === '[object Number]';

export function debounce(fn, wait) {
  let timeout = null;
  return function () {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(fn, wait);
  };
}
