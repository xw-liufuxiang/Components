const { projectName } = window.projectConfig;
const name = projectName || 'projectName';

/**
 * 判断数据类型
 * @param { any } data
 * @param { data type} type
 * @returns Boolean
 */
export function checkDataType(data, type = 'string') {
  return `[object ${type.replace(/^\S/, (s) => s.toUpperCase())}]` === Object.prototype.toString.call(data);
}

/**
 * 格式化枚举数据为数组格式
 * @param {*} enumData
 * @returns array
 */
export function formatEnum(enumData, whole = false, wholeData = '') {
  const array = [];
  Object.keys(enumData).forEach((key) => {
    array.push({
      ...enumData[key],
      key,
    });
  });

  if (whole) {
    array.unshift(wholeData || { label: '全部', value: '', key: 'all' });
  }

  return array;
}

/**
 * 使用 value 值获取当对应的整个对象
 * @param { 枚举源数据 } enumData
 * @param { 选中值 } values
 * @returns { 返回值 } Array / Object  如果 values 为数组返回值就是 array，否则为 object
 */
export function getEnumItemByValue(enumData, values) {
  const newData = Array.isArray(enumData) ? enumData : formatEnum(enumData);
  const newValues = Array.isArray(values) ? values : [values];
  const filter = newData.filter((item) => newValues.includes(item.value));
  return Array.isArray(values) ? filter : (filter[0] || {});
}

/**
 * 使用 value 值获取当对应的 label， value 值可以为数组
 * @param { 枚举源数据 } enumData
 * @param { 选中值 } values
 * @returns { 返回值 } String
 */
export function getEnumLabelByValue(enumData, values) {
  const newData = Array.isArray(enumData) ? enumData : formatEnum(enumData);
  const newValues = Array.isArray(values) ? values : [values];
  const filter = newData.filter((item) => newValues.includes(item.value));
  return filter.map((item) => item.label).toString();
}

/**
 * 使用 label 值获取当对应的 value， label 值可以为数组
 * @param { 枚举源数据 } enumData
 * @param { 选中值 } labels
 * @returns { 返回值 } String
 * @returns
 */
export function getEnumValueByLabel(enumData, labels) {
  const newData = Array.isArray(enumData) ? enumData : formatEnum(enumData);
  const newLabels = Array.isArray(labels) ? labels : [labels];
  const filter = newData.filter((item) => newLabels.includes(item.label));
  return filter.map((item) => item.value).toString();
}

/**
 * 获取 session 中的数据
 * @param { string, array } keys
 * @returns session
 */
export function getSessionStorage(keys = null) {
  const session = JSON.parse(sessionStorage.getItem(name)) || {};
  const sessionData = {};
  if (checkDataType(keys)) {
    return session[keys];
  } if (checkDataType(keys, 'array')) {
    keys.forEach((item) => {
      sessionData[item] = session[item];
    });
    return sessionData;
  }

  return session || {};
}

/**
 * 设置 session 数据
 * @param { string, Object } key
 * @param { object, empty } value
 */
export function setSessionStorage(key, value) {
  const session = getSessionStorage();
  if (checkDataType(key)) {
    session[key] = value;
  } else if (checkDataType(key, 'object')) {
    Object.keys(key).forEach((item) => {
      session[item] = key[item];
    });
  }
  sessionStorage.setItem(name, JSON.stringify(session));
}

/**
 * 把数组转为树结构
 */
export function formatTreeArray(data, parent = null) {
  const tree = [];
  let temp;
  data.forEach((item) => {
    if (item.pid === parent) {
      temp = formatTreeArray(data, item.id);
      if (temp.length > 0) {
        item.children = temp;
      }
      tree.push(item);
    }
  });
  return tree;
}

/**
 * 数组扁平化
 */
export function flattenArray(data, pid = null) {
  const array = [];
  data.forEach((item) => {
    const newItem = { ...item };
    delete newItem.children;

    if (item.children && Array.isArray(item.children) && item.children.length) {
      array.push({ ...newItem, pid, hasChildren: true });
      array.push(...flattenArray(item.children, item.id));
    } else {
      array.push({ ...newItem, pid, hasChildren: false });
    }
  });
  return array;
}

/**
 * 扁平化路由数组
 */
export function flattenRouterArray(data, pid = null, path = '') {
  const array = [];
  data.forEach((item) => {
    let fullPath = '';
    const newItem = { ...item, pid, hasChildren: true };
    delete newItem.children;

    if (path) {
      fullPath = `${path}/${newItem.path}`;
    } else {
      fullPath = `${newItem.path}`;
    }

    if (!newItem.meta) newItem.meta = {};

    newItem.meta.fullPath = fullPath;

    if (item.children && Array.isArray(item.children) && item.children.length) {
      array.push({ ...newItem });
      array.push(...flattenRouterArray(item.children, item.id, fullPath));
    } else {
      newItem.hasChildren = false;
      array.push({ ...newItem });
    }
  });
  return array;
}

/**
 * 组合菜单以及路由数据
 */
export function formatMenusAndRouterData(menuData = [], routerData = []) {
  const menus = flattenArray(menuData);
  let routes = flattenRouterArray(routerData);

  routes = routes.map((item) => {
    delete item.component;
    return item;
  });

  const newMenus = [];
  menus.forEach((menu) => {
    routes.forEach((route) => {
      if (route.meta && menu.menuName === route.meta.title) {
        newMenus.push({
          ...route,
          ...menu,
        });
      }
    });
  });

  return newMenus;
}
