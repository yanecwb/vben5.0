<template>
  <div>
    <ElTree
      ref="menuTree"
      v-loading="props.dataLoading"
      :data="props.menuTreeData"
      :props="{ children: 'children', label: 'name' }"
      node-key="id"
      highlight-current
      default-expand-all
      show-checkbox
    >
      <template #default="{ data }">
        <span class="custom-tree-node">
          <span>{{ data.label }}</span>
          <span v-if="data.type === 1" class="badge badge-soft-primary"
            >菜单</span
          >
          <span v-if="data.type === 2" class="badge badge-soft-success"
            >按钮</span
          >
        </span>
      </template>
    </ElTree>
    <div v-show="props.menuTreeData.length" class="mt-5 flex justify-end">
      <ElButton type="info" size="small" @click="setCheckedMenuIds([])"
        >清空全部</ElButton
      >
      <ElButton type="primary" size="small" @click="setCheckedMenuIds(allMenuIds)"
        >全选</ElButton
      >
    </div>
  </div>
</template>

<script lang="ts" setup name="MenuPermissionsTree">
import { isEmpty } from '@vben/utils';
import { computed, type PropType, ref } from 'vue';
import type { Menu } from './type';
import { ElTree, ElButton } from 'element-plus';

const actionTypeMap: any = {
  content: '内容(是否显示)',
  action: '动作(是否显示)',
  filter_and_column: '列表字段&过滤(是否显示)',
  filter: '列表过滤条件(是否显示)',
  column: '列表字段(是否显示)',
  disable_action: '动作(是否允许操作)',
  data_permission: '数据权限',
};

const props = defineProps({
  menuTreeData: {
    type: Array as PropType<Menu[]>,
    default: () => [],
  },
  dataLoading: {
    type: Boolean,
    default: false,
  },
});
console.log(props.menuTreeData);

const menuTree = ref<any>(null);

const hasChildrenMenuIds = computed((): number[] => {
  const hasChildrenMenuIds: number[] = [];
  const filterParentIds = (menus: Menu[]) => {
    menus.forEach((menu: Menu) => {
      if (!isEmpty(menu.children)) hasChildrenMenuIds.push(menu.id);
      if (!isEmpty(menu.children)) filterParentIds(menu.children);
    });
  };
  filterParentIds(props.menuTreeData);
  return hasChildrenMenuIds;
});

const allMenuIds = computed((): number[] => {
  const allMenuIds: number[] = [];
  const filterMenuIds = (menus: Menu[]) => {
    menus.forEach((menu: Menu) => {
      allMenuIds.push(menu.id);
      if (!isEmpty(menu.children)) filterMenuIds(menu.children);
    });
  };
  filterMenuIds(props.menuTreeData);
  return allMenuIds;
})

const setCheckedMenuIds = (menuIds: number[]) => {
  menuIds = menuIds.filter(
    (menuId: number) => !hasChildrenMenuIds.value.includes(menuId),
  );
  (menuTree.value as any)?.setCheckedKeys(menuIds);
};

const getCheckedMenuIds = (): number => {
  return (menuTree.value as any)
    ?.getCheckedNodes(false, true)
    .map((item: any) => item.id);
};

const formartActionType = (resource: string): string => {
  const typeName = resource.split(':')[0];
  return `页面权限->${actionTypeMap[typeName as string]}`;
};

defineExpose({
  setCheckedMenuIds,
  getCheckedMenuIds,
  formartActionType,
});
</script>

<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 14px;
}
</style>
