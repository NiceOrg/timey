<template>
  <div class="page-create-account authentication">
    <div class="title create-account-header">Inscription</div>
    <div class="form">
      <a-form-model layout="inline" :model="form">
        <a-form-model-item>
          <a-input v-model="form.email" size="small" placeholder="email">
            <a-icon slot="prefix" class="secondary-color" type="mail" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="form.password" type="password" size="small" placeholder="mot de passe">
            <a-icon slot="prefix" class="secondary-color" type="lock"
          /></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="form.repPassword" type="password" size="small" placeholder="répéter le mot de passe">
            <a-icon slot="prefix" class="secondary-color" type="lock" />
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="error-message">{{ errorMessage }}</div>
    <div class="send">
      <a-button class="submit-button block" type="primary" @click="createAccount">S'inscrire</a-button>
      <h4>
        <NuxtLink to="/"
          >Déjà un compte ?
          <div class="secondary-color inline">Se connecter</div></NuxtLink
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
      this.$router.push('/dashboard')
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
