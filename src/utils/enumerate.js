/**
 * 启用停用状态
 */
export const STATUS = {
  enable: { label: '启用', value: 0, status: 'inService' },
  disabled: { label: '停用', value: 1, status: 'close' },
};

/**
 * 数据库类型
 */
export const DATABASE = {
  mysql: { label: 'MYSQL', value: 'MYSQL' },
  // oracle: { label: 'ORACLE', value: 'ORACLE' },
};

/**
 * 任务模式
 */
export const TASK_MODE = {
  guide: { label: '向导式', value: 'GUIDE' },
  sql: { label: '脚本式', value: 'SQL' },
};

/**
 * 日志状态
 * 0执行中，1成功，2异常终止
 */
export const LOG_STATE = {
  inExecution: { label: '执行中', value: 0, status: 'inService', icon: 'icon-inExecution' },
  success: { label: '成功', value: 1, status: 'success', icon: 'icon-success' },
  abnormal: { label: '异常终止', value: 2, status: 'error', icon: 'icon-abnormal' },
};

/**
 * 任务状态
 * 0停用 1运行中 2终止
 */
export const TASK_STATE = {
  stop: { label: '停用', value: 0, status: 'close', color: '#d9d9d9' },
  inService: { label: '运行中', value: 1, status: 'success', color: '#52C31B' },
  termination: { label: '终止', value: 2, status: 'error', color: '#FF3B30' },
};

/**
 * 执行模式
 */
export const EXECUTE_MODE = {
  cycle: { label: '循环任务', value: 0 },
  once: { label: '单次任务', value: 1 },
};

/**
 * 请求方式
 */
export const HTPP_METHOD = {
  get: { label: 'GET', value: 'GET' },
  post: { label: 'POST', value: 'POST' },
};

/**
 * api 状态
 */
export const API_STATUE = {
  unpublished: { label: '未发布', value: 1, status: 'close' },
  published: { label: '已发布', value: 2, status: 'success' },
};

/**
 * api 状态
 */
export const APPLY_STATUS = {
  pending: { label: '待审批', value: 0, status: 'warning' },
  pass: { label: '通过', value: 1, status: 'success' },
  reject: { label: '拒绝', value: 2, status: 'error' },
  revoke: { label: '撤销', value: 3, status: 'close' },
};
