import { router } from "../../router";
const initialState = () => ({
  /**
   * @type {string}
   */
  user: null,
});
export default {
  namespaced: true,
  state: {
    user: localStorage.getItem("user") || null,
  },
  mutations: {
    ["USER_RESET"](state) {
      const s = initialState();
      for (let key in state) {
        state[key] = s[key];
      }
    },

    ["LOGIN"](state, { user }) {
      const { email } = user;
      localStorage.setItem("user", email);
      state.user = email;
    },
  },
  actions: {
    async login({ commit }, { user }) {
      commit("USER_RESET");
      commit("LOGIN", { user });
      router.push({ name: "dashboard" });
    },
    async logout() {
      localStorage.clear();
    },
  },
  getters: {
    user: ({ user }) => user,
    isLoggedIn: ({ user }) => {
      return () => !!user;
    },
  },
};
