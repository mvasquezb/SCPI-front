import { directive as vClickOutside } from "vue-clickaway";

/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const GlobalDirectives = {
  install(Vue) {
    Vue.directive("click-outside", vClickOutside);
    Vue.directive('uppercase', {
      inserted: function (el, binding, vnode) {
        if (binding.value) {
          el.addEventListener('input', async function (e) {
            e.target.value = e.target.value.toUpperCase()
            vnode.context.$emit('input', e.target.value.toUpperCase())
          })
        }
      }
    });
  }
};

export default GlobalDirectives;
