import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import { warn } from '/@/utils/log';

export type LayoutMapKey = 'LAYOUT';
const IFRAME = () => import('/@/views/sys/iframe/FrameBlank.vue');

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);

let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

// Dynamic introduction
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach((item) => {
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFRAME';
    }
    const { component, name } = item;
    const { children } = item;
    if (component) {
      const layoutFound = LayoutMap.get(component as string);
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        item.component = dynamicImport(dynamicViewsModules, component as string);
      }
    } else if (name) {
      item.component = getParentLayout();
    }
    children && asyncImportRoute(children);
  });
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    let k = key.replace('../../views', '');
    const lastIndex = k.lastIndexOf('.');
    k = k.substring(0, lastIndex);
    return k === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    );
    return;
  }
}

// 动态引入组件
export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
  routeList.forEach((route) => {
    const component = route.component as string;
    if (component) {
      if (component.toUpperCase() === 'LAYOUT') {
        route.component = LayoutMap.get(component.toUpperCase());
      } else {
        route.children = [cloneDeep(route)];
        route.component = LAYOUT;
        route.name = `${route.name}Parent`;
        route.path = '';
        const meta = route.meta || {};
        meta.single = true;
        meta.affix = false;
        route.meta = meta;
      }
    }
    route.children && asyncImportRoute(route.children);
  });
  return routeList as unknown as T[];
}

// 列表转树形结构
export function transformListToTree(routeList): AppRouteRecordRaw[] {
  if (!routeList) return [];
  // 得到根路由
  let rootRoutes = [];
  routeList.forEach((route) => {
    const component = route.component as string;
    if (component && component.toUpperCase() === 'LAYOUT') {
      // @ts-ignore
      rootRoutes.push(route);
    }
  });
  // 排序
  rootRoutes = rootRoutes.sort((item1, item2) => {
    // @ts-ignore
    return item1.orderNo - item2.orderNo;
  });
  const routeTree: AppRouteRecordRaw[] = [];
  rootRoutes.forEach((item) => {
    const menuModel = generateMenuModel(item);
    // @ts-ignore
    const childs = foundChildList(routeList, item.id);
    if (childs && childs.length > 0) {
      // @ts-ignore
      const child = getChild(routeList, item.id);
      if (child && child.length > 0) {
        menuModel['children'] = child;
      }
    } else {
      delete menuModel['redirect'];
    }
    routeTree.push(menuModel);
  });
  return routeTree;
}
function getChild(routeList, id) {
  const childMenus = [];
  const childs = foundChildList(routeList, id);
  if (childs && childs.length > 0) {
    childs.forEach((item) => {
      const menuModel = generateMenuModel(item);
      // @ts-ignore
      if (foundChildList(routeList, item.id)?.length > 0) {
        // @ts-ignore
        menuModel['children'] = getChild(routeList, item.id);
      } else {
        delete menuModel['redirect'];
      }
      // @ts-ignore
      childMenus.push(menuModel);
    });
  } else {
    return [];
  }
  return childMenus;
}

function generateMenuModel(route) {
  return {
    path: route.path,
    name: route.name,
    component: route.component,
    redirect: route.redirect,
    meta: {
      title: route.title,
      affix: route.affix,
      ignoreKeepAlive: route.ignoreKeepAlive,
      icon: route.icon,
      frameSrc: route.frameSrc,
      transitionName: route.transitionName,
      carryParam: route.carryParam,
      hideChildrenInMenu: route.hideChildrenInMenu,
      hideTab: route.hideTab,
      hideMenu: route.hideMenu,
      orderNo: route.orderNo,
      ignoreRoute: route.ignoreRoute,
      hidePathForChildren: route.hidePathForChildren,
    },
    children: [],
  };
}

function foundChildList(routeList, id: string) {
  let list = [];
  routeList.forEach((route) => {
    const pId = route.pid as string;
    if (pId && id && pId == id) {
      // @ts-ignore
      list.push(route);
    }
  });
  // 排序
  list = list.sort((item1, item2) => {
    // @ts-ignore
    return item1.orderNo - item2.orderNo;
  });
  return list;
}

/**
 * Convert multi-level routing to level 2 routing
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// Routing level upgrade
function promoteRouteLevel(routeModule: AppRouteModule) {
  // Use vue-router to splice menus
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });

  const routes = router.getRoutes();
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;

  routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

// Add all sub-routes to the secondary route
function addToChildren(
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteModule
) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteModule);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// Determine whether the level exceeds 2 levels
function isMultipleRoute(routeModule: AppRouteModule) {
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}
