import { defineComponent, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';

export default defineComponent({
  name: 'ActionModal',
  setup() {
    const shareWithData = ref<Record<string, any>>({});

    const [Modal, modalApi] = useVbenModal({
      draggable: true,
      destroyOnClose: true,
      onOpenChange(open: boolean) {
        if (open) {
          shareWithData.value = modalApi.getData();
        }
      },
      onConfirm() {},
      onCancel() {
        modalApi.close();
      },
    });

    return () => (
      <div>
        <Modal title={'组件抽离' + shareWithData.value.type}> </Modal>
      </div>
    );
  },
});
