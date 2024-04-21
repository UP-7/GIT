import pinia from "@/store";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore(pinia);
export const isHasButton = (app: any) => {
  //全局自定义指令：实现按钮的权限
  app.directive("has", {
    //代表使用这个全局自定义指令的DOM|组件挂在完毕时执行一次
    mounted(el: any, options: any) {
      //自定义指令右侧的数值:如果在用户信息buttons数组当中没有
      //从DOM树上干掉
      //el就是dom元素（使用这个按钮的button
      //options:传入进来的值v-has后面传入的值
      if (!userStore.buttons.includes(options.value)) {
        //如果不包含，干掉dom节点
        el.parentNode.removeChild(el);
      }
    },
  });
};
