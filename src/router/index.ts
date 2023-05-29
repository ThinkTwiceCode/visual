import { reactive } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useTitle } from '@vueuse/core';

import { RouterName } from '@/config/router';
import { $t } from '@/i18n/index';

import type { RouteRecordRaw } from 'vue-router';

type RouteRecordExtra = {
  meta?: {
    activeRouterName?: string, // 当前激活的路由，用于侧边栏显示选中菜单
    title?: (() => string),
    hideInSidebar?: boolean,
    hideSidebar?: boolean, // 隐藏侧边栏，如404等页面
  },
}

export type TheRoutesType = Array<RouteRecordRaw & RouteRecordExtra>;

export const routes:TheRoutesType = [
  {
    name: RouterName.Root,
    path: '/',
    component: () => import('@/views/index/index.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

const documentTitle = useTitle($t('app.title'), { titleTemplate: `%s | ECharts` });
router.afterEach((_to, _from) => {
  // 随路由变化而更改文档标题
  if (typeof _to.meta?.title === 'function') {
    const titleText = _to.meta.title() || $t('app.title');
    documentTitle.value = titleText;
  } else {
    documentTitle.value = $t('app.title');
  }

  // 切换路由后，滚动到页面顶部
  if (window) {
    window.scrollTo(0, 0);
  }
});
