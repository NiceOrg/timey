<template>
  <div class="page-login authentication">
    <languages-flags />
    <div class="title">Timey</div>
    <div class="form">
      <a-form-model layout="inline" :model="form">
        <a-form-model-item>
          <a-input ref="user" v-model="form.email" size="small" :placeholder="$t('global.eMail')">
            <a-icon slot="prefix" class="secondary-color" type="user" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input ref="pswd" v-model="form.password" size="small" type="password" :placeholder="$t('global.password')">
            <a-icon slot="prefix" class="secondary-color" type="lock" />
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="error-message">{{ errorMessage }}</div>
    <div class="send">
      <a-button class="submit-button block" type="primary" @click="authenticate">{{ $t('global.sign-in') }}</a-button>
      <h4>
        <NuxtLink :to="localePath('/create-account')"
          >{{ $t('login.no-account') }}
          <div class="secondary-color inline">{{ $t('global.sign-up') }}</div></NuxtLink
        >
      </h4>
      <h4>
        <NuxtLink :to="localePath('/dashboard')">
          {{ $t('login.continue-without-logging-in') }}
          <div class="secondary-color inline">{{ $t('global.here') }}</div></NuxtLink
        >
      </h4>
    </div>
  </div>
</template>

<script>
import { User } from '~/models'
import { authenticationPlugin } from '~/plugins'
import { timeyService } from '~/services'
export default {
  layout: 'auth-layout',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      errorMessage: '',
    }
  },
  beforeMount() {
    this.redirectIfConnected()
  },
  methods: {
    async authenticate() {
      await this.validate().catch((error) => (this.errorMessage = error.message))
    },
    async validate() {
      if (this.form.email === '') {
        throw new Error('Veuillez entrer votre email.')
      }
      if (this.form.password === '') {
        throw new Error('Veuillez entrer un mot de passe.')
      }
      const user = new User({ email: this.form.email, password: this.form.password })
      await timeyService.authenticate(user)
      this.$router.push(this.localePath('/dashboard'))
    },
    redirectIfConnected() {
      if (authenticationPlugin.get().authenticated) {
        this.$router.push(this.localePath('/dashboard'))
      }
    },
  },
}
</script>
