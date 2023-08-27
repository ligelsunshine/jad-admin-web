export function useModel() {
  // 状态枚举
  enum Status {
    ENABLE = 0,
    DISABLE = 1,
  }

  return {
    Status,
  };
}
