<template>
  <div class="page-create-account authentication">
    <div class="title create-account-header">{{ $t('global.registration') }}</div>
    <div class="form">
      <a-form-model layout="inline" :model="form">
        <a-form-model-item>
          <a-input v-model="form.email" size="small" :placeholder="$t('global.eMail')">
            <a-icon slot="prefix" class="secondary-color" type="mail" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="form.password" type="password" size="small" :placeholder="$t('global.password')">
            <a-icon slot="prefix" class="secondary-color" type="lock"
          /></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="form.repPassword" type="password" size="small" :placeholder="$t('login.repeat password')">
            <a-icon slot="prefix" class="secondary-color" type="lock" />
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="error-message">{{ errorMessage }}</div>
    <div class="send">
      <a-button class="submit-button block" type="primary" @click="createAccount">{{ $t('global.sign up') }}</a-button>
      <h4>
        <NuxtLink :to="localePath('/')"
          >{{ $t('login.already have account') }}
          <div class="secondary-color inline">{{ $t('global.sign in') }}</div></NuxtLink
        >
      </h4>
      <h4>
        <NuxtLink :to="localePath('/dashboard')"
          >{{ $t('login.continue without logging in') }}
          <div class="secondary-color inline">{{ $t('global.here') }}</div></NuxtLink
        >
      </h4>
    </div>
  </div>
</template>

<script>
import { User } from '~/models'
import { timeyService } from '~/services'
export default {
  layout: 'auth-layout',
  data() {
    return {
      form: {
        email: '',
        password: '',
        repPassword: '',
      },
      errorMessage: '',
    }
  },
  methods: {
    async createAccount() {
      await this.validate().catch((error) => (this.errorMessage = error.message))
    },
    async validate() {
      if (this.form.email === '') {
        throw new Error('Veuillez entrer une adresse mail.')
      }
      if (this.form.password === '') {
        throw new Error('Veuillez entrer un mot de passe.')
      }
      if (this.form.repPassword === '') {
        throw new Error('Veuillez confirmer votre mot de passe.')
      }
      if (this.form.password !== this.form.repPassword) {
        throw new Error('Les mots de passes ne correspondent pas.')
      }
      const user = new User({ password: this.form.password, repeatPassword: this.form.repPassword, email: this.form.email })
      await timeyService.add(user)
      this.$router.push(this.localePath('/dashboard'))
    },
  },
}
</script>

<style scoped>
.title {
  font-size: 3.5rem;
  margin-top: 5rem;
}
</style>
