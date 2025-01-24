import { defineComponent, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { getUserById, updateUser, createUser } from '../service';
import { useVbenForm } from '#/adapter/form';
import { initSchema } from './config';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'ActionModal',
  setup() {
    const shareWithData = ref<Record<string, any>>({ type: 'add' });

    const [Modal, { getData, setState, close }] = useVbenModal({
      draggable: true,
      destroyOnClose: true,
      zIndex: 2005,
      loading: true,
      onOpenChange: async (open: boolean) => {
        if (open) {
          shareWithData.value = getData();
          if (shareWithData.value.type === 'edit') {
            const res = await getUserById({ id: shareWithData.value.id });
            formApi.setValues({
              ...res,
              roleIds: res.roleIds?.map((i: string) => '' + i),
              status: res.status === 1 ? true : false,
            });
          }
          setState({
            loading: false,
          });
        }
      },
      onConfirm: async () => {
        const { valid } = await formApi.validate();
        if (valid) {
          try {
            setState({
              confirmLoading: true,
              closeOnClickModal: false,
            });
            const { status, ...req } = await formApi.getValues();
            if (shareWithData.value.type === 'add') {
              await createUser({ ...req, status: status ? 1 : 2 });
            } else {
              await updateUser(req);
            }
            ElMessage({
              type: 'success',
              message: '操作成功',
            });
            close();
          } catch (error) {
          } finally {
            setState({
              confirmLoading: false,
              closeOnClickModal: true,
            });
          }
        }
      },
      onCancel() {
        close();
      },
    });

    const [BaseForm, formApi] = useVbenForm({
      commonConfig: {
        labelWidth: 70,
        componentProps: {
          class: 'w-full',
        },
      },
      submitButtonOptions: {
        show: false,
      },
      resetButtonOptions: {
        show: false,
      },
      layout: 'horizontal',
      schema: initSchema,
    });

    return () => (
      <div>
        <Modal
          title={
            (shareWithData.value.type === 'add' ? '新增' : '编辑') + '员工'
          }
        >
          <BaseForm />
        </Modal>
      </div>
    );
  },
});
