import { defineComponent } from 'vue';
import { Page } from '@vben/common-ui';
import Crud from '#/components/Crud/index.vue';
import { ElButton, ElMessageBox, ElMessage } from 'element-plus';
import { tableOptions, searchOption } from './config';
import { queryRoles, deleteRole } from './service';

import { BaseCrudService } from '#/components/Crud/base';

import { useVbenModal } from '@vben/common-ui';
import ActionModal from './modules/ActionModal';

import { sleep } from '#/utils/global';
export default defineComponent({
  name: 'role',
  setup() {
    const {
      tableDataLoading,
      tableOptions: top,
      tableDataTotal,
      tableData,
      searchParam,
      paginationParams,
      searchValueChange,
      getTableData,
    } = new BaseCrudService({
      tableOptions: tableOptions(),
      searchOption: searchOption(),
      sortParams: { descs: 'id', ascs: '' },
      fetchTableDataList: async (initSearchParam) => {
        const { records, total } = await queryRoles(initSearchParam);
        return new Promise((resolve) => {
          resolve({ records, total });
        });
      },
      fetchSelectOptions: () => {},
    });

    const confirmDelete = async (id: string | number) => {
      await ElMessageBox.confirm(
        '此操作将永久删除该角色, 是否继续?',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: async (action, instance, done) => {
            try {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = 'Loading...';
                await deleteRole({ id });
              }
              done();
            } catch (e) {
            } finally {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = '确定';
            }
          },
        },
      );
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      await getTableData();
    };

    const [Modal, modalApi] = useVbenModal({
      connectedComponent: ActionModal,
    });
    const openModal = (type: 'add' | 'edit', id?: string | number) => {
      modalApi
        .setData({
          id,
          type,
        })
        .open();
    };
    return () => (
      <Page>
        <Crud
          searchParam={searchParam.value}
          tableDataLoading={tableDataLoading.value}
          tableOptions={top.value}
          tableData={tableData.value}
          tableDataTotal={tableDataTotal.value}
          paginationParams={paginationParams.value}
          onSearchValueChange={searchValueChange}
        >
          {{
            'header-right-action': () => (
              <ElButton type="primary" onClick={() => openModal('add')}>
                新增角色
              </ElButton>
            ),
            menu: ({ row }: { row: Record<string, any> }) => (
              <div class="flex justify-evenly">
                <span
                  class="icon-[line-md--edit-twotone] h-[15px] w-[15px] cursor-pointer text-[#2265ff]"
                  title="编辑"
                  onClick={() => openModal('edit', row.id)}
                ></span>
                <span
                  class="icon-[icon-park-outline--delete] h-[15px] w-[15px] text-[#f46a6a]"
                  title="删除"
                  onClick={() => confirmDelete(row.id)}
                ></span>
              </div>
            ),
          }}
        </Crud>

        {/* Modal */}
        <Modal />
      </Page>
    );
  },
});
