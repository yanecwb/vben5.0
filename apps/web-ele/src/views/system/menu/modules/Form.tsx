import { defineComponent, watch, shallowRef, type PropType } from 'vue';
import { useVbenForm } from '#/adapter/form';
import { addMenu, updateMenu } from '../service';
import { initSchema } from './formConfig';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'menuForm',
  props: {
    currentMenuForm: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
      required: true,
    },
    addMenuType: {
      type: String as PropType<'editMenu' | 'addNextMenu' | 'addSameMenu'>,
      default: () => 'addNextMenu',
      required: true,
    },
  },
  setup(props) {
    const saveMenuLoading = shallowRef<boolean>(false);

    const [BaseForm, formApi] = useVbenForm({
      commonConfig: {
        labelWidth: 70,
        componentProps: {
          class: 'w-full',
        },
      },
      submitButtonOptions: {
        content: '提交',
      },
      resetButtonOptions: {
        content: '重置',
      },
      handleReset: () => {
        formApi.resetForm();
      },
      handleSubmit: async () => {
        try {
          const formData = await formApi.getValues();
          formApi.setState({
            submitButtonOptions: { loading: true },
          });
          switch (props.addMenuType) {
            case 'editMenu':
              await updateMenu({
                ...formData,
                id: props.currentMenuForm.id,
                keepalive: 0,
              });
              break;
            case 'addNextMenu':
              await addMenu(formData);
              break;
            case 'addSameMenu':
              await addMenu(formData);
              break;
          }
          ElMessage({
            type: 'success',
            message: '删除成功',
          });
        } catch (error) {
        } finally {
          formApi.setState({
            submitButtonOptions: { loading: false },
          });
        }
      },
      layout: 'horizontal',
      schema: initSchema(),
    });

    watch(
      () => props.currentMenuForm,
      (val) => {
        formApi.setValues(val);
      },
      { deep: true },
    );

    watch(
      () => props.addMenuType,
      (v) => {
        formApi.setState((prev) => {
          if (props.addMenuType === 'editMenu') {
            formApi.setValues(props.currentMenuForm);
          } else {
            formApi.resetForm();
            if (props.addMenuType === 'addNextMenu') {
              formApi.setValues({
                parentId: props.currentMenuForm.id,
              });
            } else {
              formApi.setValues({ parentId: props.currentMenuForm.parentId });
            }
          }

          return { schema: initSchema(props.addMenuType === 'editMenu') };
        });
      },
      { deep: true, immediate: true },
    );

    return () => <BaseForm />;
  },
});
