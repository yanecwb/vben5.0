import { defineComponent, shallowRef, nextTick, ref, onMounted } from 'vue';
import { deleteMenuApi, getMenuDetail, getMenuTree } from './service';
import { type Menu } from './type';
import { addMenuTypeMap, createEmptyMenu } from './config';
import {
  ElMessage,
  ElRow,
  ElCol,
  ElButton,
  ElMessageBox,
  ElTree,
  ElCard,
  ElAlert,
} from 'element-plus';
import { isEmpty } from '@vben/utils';
import { Page } from '@vben/common-ui';
import FromModule from './modules/Form';
import type Node from 'element-plus/es/components/tree/src/model/node.mjs';

export default defineComponent({
  name: 'menu',
  setup() {
    const isCreate = shallowRef<boolean>(false);
    const addMenuType = shallowRef<'editMenu' | 'addNextMenu' | 'addSameMenu'>(
      'editMenu',
    );

    const menuTree = ref<InstanceType<typeof ElTree>>();
    let currentSelectedMenu = ref<Menu>(createEmptyMenu());
    let menuForm = ref<Menu>(createEmptyMenu());
    let menuTreeData = ref<Menu[]>([]);

    const treeDataLoading = shallowRef<boolean>(false); //樹組件loading
    const formDataLoading = shallowRef<boolean>(false); ////表单組件loading

    const fetchMenuTreeData = async () => {
      try {
        treeDataLoading.value = true;
        formDataLoading.value = true;
        const res: Menu[] = (await getMenuTree()) ?? [];
        const setMenuStatus = (arr: Menu[]) => {
          arr.forEach((item: any) => {
            if (!isEmpty(item.children)) {
              setMenuStatus(item.children);
            } else {
              item._showDeleteBtn = false;
            }
          });
        };
        setMenuStatus(res);
        menuTreeData.value = res;
      } finally {
        treeDataLoading.value = false;
      }
    };
    const handleNodeClick = async (data: Menu) => {
      isCreate.value = false;
      addMenuType.value = 'editMenu';
      try {
        formDataLoading.value = true;
        const resp = await getMenuDetail({
          id: data.id + '',
        });
        currentSelectedMenu.value = {
          ...resp,
          ...{ children: data.children },
        };
        menuForm.value = resp;
      } finally {
        formDataLoading.value = false;
      }
    };

    const addMenu = (type: 'editMenu' | 'addNextMenu' | 'addSameMenu') => {
      isCreate.value = true;
      addMenuType.value = type;
      menuForm.value = createEmptyMenu();
    };

    const cancelCreate = () => {
      isCreate.value = false;
      addMenuType.value = 'editMenu';
      menuForm.value = currentSelectedMenu.value;
    };

    const deleteMenu = async (data: Menu) => {
      try {
        await ElMessageBox.confirm(
          '此操作将永久删除该菜单/按钮, 删除后不可恢复, 是否继续?',
          '温馨提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = 'Loading...';
                await deleteMenuApi({ id: data.id + '' });
                instance.confirmButtonLoading = false;
              }
              done();
            },
          },
        );
        ElMessage({
          type: 'success',
          message: '删除成功',
        });
        await fetchMenuTreeData();
      } catch (e) {}
    };

    onMounted(async () => {
      await fetchMenuTreeData();
      nextTick(() => {
        menuTree.value?.setCurrentNode(
          menuTreeData.value[0] as unknown as Node,
          true,
        );
        handleNodeClick(menuTreeData.value[0] as Menu);
      });
    });

    return () => (
      <Page>
        <ElRow>
          <ElCol span={6}>
            <ElCard class="h-[80vh] overflow-auto rounded-md">
              <ElButton type="primary" class="mb-[20px] w-full">
                管理端平台
              </ElButton>
              <ElTree
                v-loading={treeDataLoading.value}
                ref={menuTree}
                data={menuTreeData.value}
                node-key="id"
                default-expand-all
                highlight-current
                props={{ children: 'children', label: 'name' }}
                onNode-click={handleNodeClick}
              >
                {{
                  default: ({ node, data }: any) => (
                    <div
                      class="flex w-full items-center justify-between"
                      onMouseover={() => (data._showDeleteBtn = true)}
                      onMouseout={() => (data._showDeleteBtn = false)}
                    >
                      <span>{node.label}</span>
                      <span
                        v-show={data._showDeleteBtn}
                        class="icon-[icon-park-outline--delete] ml-[50px] text-[#e95f5fcc]"
                        onClick={() => deleteMenu(data)}
                      ></span>
                    </div>
                  ),
                }}
              </ElTree>
            </ElCard>
          </ElCol>
          <ElCol span={18} class="pl-1">
            <ElCard class="h-[80vh] overflow-auto rounded-md">
              <div class="mb-3 flex items-center justify-between">
                <ElAlert
                  title="正在操作"
                  description={
                    addMenuTypeMap[addMenuType.value].text +
                    '-' +
                    currentSelectedMenu.value.name
                  }
                  type="warning"
                  closable={false}
                  show-icon
                  class="!mr-3 flex-1"
                />
                {isCreate.value ? (
                  <ElButton type="primary" plain onClick={cancelCreate}>
                    返回
                  </ElButton>
                ) : (
                  <>
                    <ElButton
                      type="primary"
                      plain
                      onClick={() => addMenu('addSameMenu')}
                    >
                      新增同级
                    </ElButton>
                    <ElButton
                      type="success"
                      plain
                      onClick={() => addMenu('addNextMenu')}
                    >
                      新增下级
                    </ElButton>
                  </>
                )}
              </div>
              <FromModule
                currentMenuForm={currentSelectedMenu.value}
                addMenuType={addMenuType.value}
                v-loading={formDataLoading.value}
              />
            </ElCard>
          </ElCol>
        </ElRow>
      </Page>
    );
  },
});
