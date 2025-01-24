import { defineComponent, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { getRoleById, createRole, updateRole } from '../service';
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
            formApi.setValues(
              await getRoleById({ id: shareWithData.value.id }),
            );
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
            const req = await formApi.getValues();
            if (shareWithData.value.type === 'add') {
              await createRole(req);
            } else {
              await updateRole(req);
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
            (shareWithData.value.type === 'add' ? '新增' : '编辑') + '角色'
          }
        >
          <BaseForm />
        </Modal>
      </div>
    );
  },
});
