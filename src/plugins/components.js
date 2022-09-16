import BsContainer from '@/components/business/bs-container';
import BsTableMix from '@/components/business/bs-table-mix';
import TableStatus from '@/components/table-status';
import XwIcon from '@/components/xw-icon';

const components = [
  BsContainer,
  BsTableMix,
  TableStatus,
  XwIcon,
];

function install(Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
}

export default {
  install,
  BsContainer,
  TableStatus,
  BsTableMix,
  XwIcon,
};
