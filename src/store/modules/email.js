import axios from "axios";
import config from "@/config"

export default {
  state: {
    email: null,
  },
  actions: {
    checkEmail(ctx, email) {
      ctx.commit("setLoading", {
        name: "emailChecker",
        enable: true
      });
      ctx.commit("setRelictum", null);
      ctx.commit("setError", null);
      axios.get(`${config.request}/api/v1/user/get-relictum?email=${email}`).then(resp => {

        if(!resp || !resp.data) {
          console.error(resp)
          ctx.commit("setError", "Server Error");
          return;
        }

        if(!resp.data.success) {
          ctx.commit("setError", "Wrong email");
          return;
        }

        if(resp.data.relictum) ctx.commit("setRelictum", resp.data.relictum);
        if(resp.data.success) ctx.commit("setStep", 'relictum');

      }).catch(err => {
        console.error(err)
        ctx.commit("setError", "Server Error");
      }).finally(() => {
        ctx.commit("setLoading", {
          name: "emailChecker",
          enable: false
        });
      })
    },
  },
  mutations: {
    setEmail(state, email) {
      state.email = email;
    },
  },
  getters: {
    getEmail(state) {
      return state.email;
    },
  }
}