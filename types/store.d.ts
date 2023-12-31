import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface User {
  id: string | number;
  username: string;
  name: string;
  sex: number;
  age: number;
  birthday: Date;
  email: string;
  phone: string;
  avatar: string;
  avatarBase64: string;
  city: string;
  lastLogin: Date;
  remark?: string;
  deptId?: string;
  dept?: any;
  roleIds?: string[];
  roles?: Role[];
}

export interface Role {
  id: string | number;
  name: string;
  code: string;
  level: number;
  status: number;
  description?: string;
  remark?: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
