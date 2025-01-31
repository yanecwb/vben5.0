import { defineComponent } from 'vue';
import { Page } from '@vben/common-ui';
import Crud from '#/components/Crud/index.vue';
import { ElButton, ElMessageBox, ElMessage } from 'element-plus';
import { tableOptions, searchOption } from './config';
import { queryUsers, deleteUser } from './service';

import { BaseCrudService } from '#/components/Crud/base';

import { useVbenModal } from '@vben/common-ui';
import ActionModal from './modules/ActionModal';

export default defineComponent({
  name: 'user',
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
        const { records, total } = await queryUsers(initSearchParam);
        return new Promise((resolve) => {
          resolve({ records, total });
        });
      },
      fetchSelectOptions: () => {},
    });

    const confirmDelete = async (id: string | number) => {
      try {
        await ElMessageBox.confirm(
          '此操作将永久删除该员工账号, 是否继续?',
          '温馨提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = 'Loading...';
                await deleteUser({ id });
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
        await getTableData();
      } catch (e) {}
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
                新增员工账号
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
            roles: ({ row }: { row: Record<string, any> }) =>
              row.roles && <span> {row.roles.join(',')}</span>,
          }}
        </Crud>
        <Modal />
      </Page>
    );
  },
});
