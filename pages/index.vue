<template>
  <div class="page-login">
    <div class="title">Time Tracker</div>
    <div class="login">
      <a-form-model
        layout="inline"
        :model="formInline"
        @submit="handleSubmit"
        @submit.native.prevent
      >
        <a-form-model-item>
          <a-input v-model="formInline.user" placeholder="Username">
            <a-icon
              slot="prefix"
              type="user"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-model-item>
        <br />
        <a-form-model-item>
          <a-input
            v-model="formInline.password"
            type="password"
            placeholder="Password"
          >
            <a-icon
              slot="prefix"
              type="lock"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-model-item>
        <br />
        <a-form-model-item>
          <a-button
            type="primary"
            html-type="submit"
            :disabled="formInline.user === '' || formInline.password === ''"
          >
            Log in
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="create-account">
      <a-button>
        <NuxtLink to="/create-account">Create account</NuxtLink>
      </a-button>
    </div>
    <div class="nolog">
      <NuxtLink to="/dashboard">Continue without signing in</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'auth',
  data() {
    return {
      formInline: {
        user: '',
        password: '',
      },
    }
  },
  mounted() {
    console.log('si authentifié -> redirect vers dashboard')
  },
  methods: {
    handleSubmit() {
      console.log(this.formInline)
    },
  },
})
</script>
