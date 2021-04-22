<template>
  <div class="page-login">
    <div class="title">Timey</div>
    <div class="login">
      <a-form-model layout="inline" :model="form" @submit="handleSubmit" @submit.native.prevent>
        <a-form-model-item>
          <a-input v-model="form.user" placeholder="Username">
            <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-model-item>
        <br />
        <a-form-model-item>
          <a-input v-model="form.password" type="password" placeholder="Password">
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-model-item>
        <br />
        <a-form-model-item>
          <a-button type="primary" html-type="submit" :disabled="form.user === '' || form.password === ''"> Log in </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="create-account">
      <a-button><NuxtLink to="/create-account">Create account</NuxtLink></a-button>
    </div>
    <div class="nolog">
      <NuxtLink to="/dashboard">Continue without signing in</NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth-layout',
  data() {
    return {
      form: {
        user: '',
        password: '',
      },
    }
  },
  methods: {
    handleSubmit() {
      console.log(this.form)
    },
  },
}
</script>

<style scoped>
.page-login {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}

.login {
  text-align: center;
}

.ant-form-item {
  margin-right: 0rem;
}
</style>
