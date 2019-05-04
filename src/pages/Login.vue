<template>
  <div class="wrapper">
    <div class="login container-fluid h-100">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-4 form-container">
          <LoadingSpinner v-if="loggingIn" />
          <h3 class="pb-4 mx-auto text-center font-weight-bold font-italic">
            Sistema de Clasificado de Piezas
            <br>SCPI
          </h3>
          <p v-if="loginError">{{ loginError }}</p>
          <p v-if="loginSuccessful">Login Successful</p>
          <form @submit.prevent="loginSubmit">
            <div class="form-group input-group">
              <input
                type="text"
                class="form-control"
                id="emp-code"
                placeholder="Código de Empleado"
                v-model="username"
              >
            </div>
            <div class="form-group input-group">
              <input
                type="password"
                class="form-control"
                id="emp-password"
                placeholder="Contraseña"
                v-model="password"
              >
            </div>
            <button class="btn btn-primary" type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapState(["loggingIn", "loginError", "loginSuccessful"])
  },
  methods: {
    ...mapActions(["doLogin", "doLogout"]),
    loginSubmit() {
      this.doLogin({
        username: this.username,
        password: this.password
      });
    }
  },
  watch: {
    loginSuccessful: function(newVal) {
      if (newVal) {
        this.$router.replace("home");
      }
    }
  },
  mounted() {
    this.doLogout();
  }
};
</script>

<style lang="scss">
.login {
  background-color: #eaedf4;
}
.form-container {
  background-color: #fff;
  padding: 20px;
}
form {
  text-align: center;

  input.form-control {
    background-color: #f6f6f6;
    border: 1px solid grey;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    -webkit-border-radius: 5px 5px 5px 5px;
    border-radius: 5px 5px 5px 5px;

    &:active {
      background-color: #fff;
    }
  }
}
</style>
