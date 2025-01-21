import {
  defineComponent,
  reactive,
  shallowRef,
  nextTick,
  ref,
  onMounted,
} from 'vue';
import {
  addMenu,
  deleteMenuApi,
  getMenuDetail,
  getMenuTree,
  updateMenu,
} from './service';
import { type Menu } from './type';
import {
  createEmptyMenu,
  createEmptyPermission,
  permissionTypeOptions,
} from './config';
import {
  ElMessage,
  ElRow,
  ElCol,
  ElButton,
  ElMessageBox,
  ElTree,
  ElCard,
} from 'element-plus';
import { isEmpty } from '@vben/utils';
import { Page } from '@vben/common-ui';

export default defineComponent({
  name: 'menu',
  setup() {
    const isCreate = shallowRef<boolean>(false);
    const addMenuType = shallowRef<'menu' | 'submenu'>('menu');

    const menuTree = ref(null);
    let currentSelectedMenu = ref<Menu>(createEmptyMenu());
    let menuForm = reactive<Menu>(createEmptyMenu());
    let menuTreeData = ref<Menu[]>([]);

    const treeDataLoading = shallowRef<boolean>(false);
    const formDataLoading = shallowRef<boolean>(false);
    const saveMenuLoading = shallowRef<boolean>(false);
    const menuLoading = shallowRef<boolean>(false);

    const fetchMenuTreeData = async () => {
      try {
        treeDataLoading.value = true;
        const data = await getMenuTree();

        if (!isEmpty(data)) {
          menuTreeData.value = data;

          // 设置每条数据额外属性
          setMenuStatus(menuTreeData.value);

          // 设置菜单默认选中
          nextTick(() => {
            menuTree.value &&
              (menuTree.value as any).setCurrentNode(menuTreeData.value[0]);
            handleNodeClick(menuTreeData.value[0] as Menu);
          });
        }
      } finally {
        treeDataLoading.value = false;
      }
    };

    const setMenuStatus = (menu: any[]) => {
      menu.forEach((item: any) => {
        if (!isEmpty(item.children)) {
          setMenuStatus(item.children);
        } else {
          // this.$set(item, '_showDeleteBtn', false)
        }
      });
    };

    const handleNodeClick = async (data: Menu) => {
      isCreate.value = false;
      try {
        menuLoading.value = true;
        const resp = await getMenuDetail({
          id: data.id + '',
        });
        currentSelectedMenu = { ...resp.data, ...{ children: data.children } };
        menuForm = resp.data;
      } finally {
        menuLoading.value = false;
      }
    };
    const addMenu = (type: 'menu' | 'submenu') => {
      menuLoading.value = false;
      isCreate.value = true;
      addMenuType.value = type;
      menuForm = createEmptyMenu();
    };

    const cancelCreate = () => {
      isCreate.value = false;
      menuForm = currentSelectedMenu.value;
    };

    const deleteMenu = (data: Menu) => {
      ElMessageBox.confirm('此操作将永久删除该菜单, 是否继续?').then(
        async () => {
          await deleteMenuApi({
            id: data.id + '',
          });
          ElMessage.success('删除成功');
          fetchMenuTreeData();
        },
      );
    };

    onMounted(async () => {
      await fetchMenuTreeData();
    });

    return () => (
      <Page>
        <ElRow>
          <ElCol span={6}>
            <ElCard class="bg-background rounded-md">
              <div class="card h-[80vh] overflow-auto">
                <div class="card-body pd-20">
                  <div class="mg-0-0-20">
                    <ElButton type="primary" style="width: 100%">
                      管理端平台
                    </ElButton>
                  </div>
                  {/* {false && <ElButton class="mg-0-0-20 w-100">Create</ElButton>} */}
                  <ElTree
                    ref="menuTree"
                    data={menuTreeData.value}
                    show-checkbox
                    node-key="id"
                    highlight-current
                    props={{ children: 'children', label: 'name' }}
                  ></ElTree>
                </div>
              </div>
            </ElCard>
          </ElCol>
          <ElCol span={18} class="pd-0-5">
            <ElCard class="rounded-md">
              <div class="card h-[80vh] overflow-auto">
                <div class="card-body pd-20">
                  <h5 class="mg-0-0-20">
                    {isCreate
                      ? `新增${addMenuType.value === 'menu' ? '同级菜单' : '子菜单'}`
                      : '编辑菜单'}
                  </h5>
                </div>
              </div>
            </ElCard>
          </ElCol>
        </ElRow>
      </Page>
    );
  },
});
