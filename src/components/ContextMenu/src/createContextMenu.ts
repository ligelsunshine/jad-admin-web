import contextMenuVue from './ContextMenu.vue';
import { isBoolean, isClient, isFunction } from '/@/utils/is';
import { CreateContextOptions, ContextMenuProps, ContextMenuItem } from './typing';
import { createVNode, render } from 'vue';
import { usePermission } from '/@/hooks/web/usePermission';

const menuManager: {
  domList: Element[];
  resolve: Fn;
} = {
  domList: [],
  resolve: () => {},
};

const { hasPermission } = usePermission();
export const createContextMenu = function (options: CreateContextOptions) {
  const { event } = options || {};

  event && event?.preventDefault();

  if (!isClient) {
    return;
  }

  if (options.items) {
    const items: ContextMenuItem[] = [];
    options.items.forEach((item) => {
      const ifShow = item.ifShow;
      if (item.auth && hasPermission(item.auth)) {
        items.push(item);
      } else if (ifShow) {
        if (isBoolean(ifShow) && ifShow) {
          items.push(item);
        }
        if (isFunction(ifShow) && ifShow()) {
          items.push(item);
        }
      }
    });
    options.items = items;
  }
  if (!options.items || options.items.length == 0) {
    return;
  }
  return new Promise((resolve) => {
    const body = document.body;

    const container = document.createElement('div');
    const propsData: Partial<ContextMenuProps> = {};
    if (options.styles) {
      propsData.styles = options.styles;
    }

    if (options.items) {
      propsData.items = options.items;
    }

    if (options.event) {
      propsData.customEvent = event;
      propsData.axis = { x: event.clientX, y: event.clientY };
    }

    const vm = createVNode(contextMenuVue, propsData);
    render(vm, container);

    const handleClick = function () {
      menuManager.resolve('');
    };

    menuManager.domList.push(container);

    const remove = function () {
      menuManager.domList.forEach((dom: Element) => {
        try {
          dom && body.removeChild(dom);
        } catch (error) {}
      });
      body.removeEventListener('click', handleClick);
      body.removeEventListener('scroll', handleClick);
    };

    menuManager.resolve = function (arg) {
      remove();
      resolve(arg);
    };
    remove();
    body.appendChild(container);
    body.addEventListener('click', handleClick);
    body.addEventListener('scroll', handleClick);
  });
};

export const destroyContextMenu = function () {
  if (menuManager) {
    menuManager.resolve('');
    menuManager.domList = [];
  }
};
