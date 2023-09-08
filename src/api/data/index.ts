/**
 * 状态枚举
 */
export enum Status {
  ENABLE = 0,
  DISABLE = 1,
}
export function useDataModel() {
  /**
   * 状态渲染
   *
   * @param status 状态
   */
  function renderOfStatus(status: Status) {
    switch (status) {
      case Status.ENABLE:
        return '启用';
      case Status.DISABLE:
        return '停用';
      default:
        return 'undefined';
    }
  }

  return {
    Status,
    renderOfStatus,
  };
}
