<template>
  <div class="page-login authentication">
    <div class="title">Timey</div>
    <div class="form">
      <a-form-model layout="inline" :model="form">
        <a-form-model-item>
          <a-input ref="user" v-model="form.email" size="small" placeholder="email">
            <a-icon slot="prefix" class="secondary-color" type="user" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input ref="pswd" v-model="form.password" size="small" type="password" placeholder="mot de passe">
            <a-icon slot="prefix" class="secondary-color" type="lock" />
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="g-signin2" data-onsuccess="onSignInWithGoogle" data-theme="dark"></div>
    <div @click="signOut()">Sign out</div>

    <div class="error-message">{{ errorMessage }}</div>
    <div class="send">
      <a-button class="submit-button block" type="primary" @click="authenticate">Connexion</a-button>
      <h4>
        <NuxtLink to="/create-account"
          >Pas encore de compte ?
          <div class="secondary-color inline">S'inscrire</div></NuxtLink
        >
      </h4>
      <h4>
        <NuxtLink to="/dashboard"
          >Continuez sans vous connecter
          <div class="secondary-color inline">ici</div></NuxtLink
        >
      </h4>
    </div>
  </div>
</template>

<script>
import { emit, on } from 'shuutils'
import { User } from '~/models'
import { authenticationPlugin, AUTHENTICATION_GET, AUTHENTICATION_SEND } from '~/plugins'
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
  head() {
    return {
      meta: [
        {
          name: 'google-signin-client_id',
          content: process.env.GOOGLE_CLIENT_ID,
        },
      ],
      script: [
        {
          src: 'https://apis.google.com/js/platform.js',
        },
      ],
    }
  },
  beforeMount() {
    this.redirectIfConnected()
    this.googleAuthentication()
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
      this.$router.push('/dashboard')
    },
    redirectIfConnected() {
      on(AUTHENTICATION_SEND, () => {
        if (authenticationPlugin.get().authenticated) {
          this.$router.push('/dashboard')
        }
      })
      emit(AUTHENTICATION_GET)
    },
    // onSignIn need to be send to window in client side to use the onSignIn method from google
    googleAuthentication() {
      if (process.client) {
        window.onSignInWithGoogle = this.onSignInWithGoogle
      }
    },
    async onSignInWithGoogle(googleUser) {
      const user = new User({ email: googleUser.getBasicProfile().getEmail(), _id: googleUser.getAuthResponse().id_token })
      await timeyService.authenticateWithGoogle(user)
    },
    signOut() {
      // eslint-disable-next-line no-undef
      gapi.auth2.getAuthInstance().disconnect()
    },
  },
}
</script>
