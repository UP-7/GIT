//小仓库：layout组件相关配置仓库
import { defineStore } from "pinia";
let useLayourSettingStore = defineStore("SettingStore", {
  state: () => {
    return {
      fold: false, //用于控制菜单折叠还是收起
      refsh: false,
    };
  },
});
export default useLayourSettingStore;
