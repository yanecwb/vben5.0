import { defineComponent, nextTick, onMounted, ref, shallowRef } from 'vue';
import {
  ElAlert,
  ElMessage,
  ElRow,
  ElCol,
  ElButton,
  ElTree,
  ElCard,
} from 'element-plus';
import { Page } from '@vben/common-ui';
import { getRoleOptions } from '#/api/core/selectList';
import { getRolePermissionIds, updateRolePermission } from '../role/service';
import { getMenuTree } from '../menu/service';

import MenuPermissionsTree from '#/components/MenuPermissionsTree/index.vue';
import { isEmpty } from '@vben/utils';
import { type Menu } from '#/components/MenuPermissionsTree/type';

export default defineComponent({
  name: 'permission',
  setup() {
    const roleTree = ref<InstanceType<typeof ElTree>>();
    const treeLeftDataLoading = shallowRef<boolean>(true);
    const savePermissionLoading = shallowRef<boolean>(false);
    const roleTreeData = ref<Record<string, any>[]>([]);
    const currentSelectedNode = ref<Record<string, any>>({});
    const handleLeftNodeClick = (data: Record<string, any>) => {
      currentSelectedNode.value = data;
      fetchRolePermissions(data.value);
    };

    const menuTree = ref<any>();
    const menuTreeDataLoading = shallowRef<boolean>(false);
    const menuTreeData = ref<Menu[]>([]);
    const fetchRolePermissions = async (roleId: string) => {
      try {
        menuTreeDataLoading.value = true;
        const data = await getRolePermissionIds({
          roleId: Number(roleId),
        });

        menuTree.value?.setCheckedMenuIds(data);
      } catch (e) {
        console.error(e);
        menuTree.value?.setCheckedMenuIds([]);
      } finally {
        menuTreeDataLoading.value = false;
      }
    };

    // 获取菜单树数据
    const fetchMenuTreeData = async (category?: number) => {
      try {
        menuTreeDataLoading.value = true;
        const data = await getMenuTree();
        if (!isEmpty(data)) {
          menuTreeData.value = data;
        }
      } finally {
        // menuTreeDataLoading.value = false;
      }
    };

    // 保存权限
    const saveRolePermission = async () => {
      try {
        savePermissionLoading.value = true;
        const roleId = currentSelectedNode.value.value;
        await updateRolePermission({
          roleId: Number(currentSelectedNode.value.value),
          menuIds: menuTree.value?.getCheckedMenuIds(),
        });
        fetchRolePermissions(roleId);
        ElMessage.success('更新成功');
      } finally {
        savePermissionLoading.value = false;
      }
    };

    onMounted(async () => {
      // 获取角色列表
      const res = await getRoleOptions();
      roleTreeData.value = res;
      treeLeftDataLoading.value = false;

      await fetchMenuTreeData();

      nextTick(() => {
        roleTree.value?.setCurrentNode(res[0] as any, false);
        handleLeftNodeClick(res[0]);
      });
    });
    return () => (
      <Page>
        <ElRow>
          <ElCol span={6}>
            <ElCard class="h-[80vh] overflow-auto rounded-md">
              <ElButton type="primary" class="mb-[20px] w-full">
                角色列表
              </ElButton>
              <ElTree
                v-loading={treeLeftDataLoading.value}
                default-expand-all
                ref={roleTree}
                data={roleTreeData.value}
                node-key="value"
                highlight-current
                props={{ children: 'children', label: 'label' }}
                onNode-click={handleLeftNodeClick}
              />
            </ElCard>
          </ElCol>
          <ElCol span={18} class="pl-1">
            <ElCard class="h-[80vh] overflow-auto rounded-md">
              <div class="mb-3 flex items-center justify-between">
                {currentSelectedNode.value.label && (
                  // <div class="text-[14px]">
                  //   <span class="text-primary">{`${currentSelectedNode.value.label}角色`}</span>
                  //   权限分配
                  // </div>
                  <ElAlert
                    title={
                      '正在操作：' + currentSelectedNode.value.label + '角色'
                    }
                    type="warning"
                    closable={false}
                    show-icon
                    class="mr-3 flex-1"
                  />
                )}
                <ElButton
                  class="text-right"
                  size="small"
                  type="primary"
                  loading={savePermissionLoading.value}
                  onClick={saveRolePermission}
                >
                  更新权限
                </ElButton>
              </div>
              <MenuPermissionsTree
                ref={menuTree}
                menuTreeData={menuTreeData.value}
                dataLoading={menuTreeDataLoading.value}
              ></MenuPermissionsTree>
            </ElCard>
          </ElCol>
        </ElRow>
      </Page>
    );
  },
});
