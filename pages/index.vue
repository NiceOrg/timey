<template>
  <div class="page-login authentication">
    <div class="title">Timey</div>
    <div class="form">
      <a-form-model layout="inline" :model="form">
        <a-form-model-item>
          <a-input ref="user" v-model="form.user" size="small" placeholder="nom d'utilisateur">
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input ref="pswd" v-model="form.password" size="small" type="password" placeholder="mot de passe">
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="send">
      <a-button class="submit-button block" type="primary">Connexion</a-button>
      <h4>
        <NuxtLink to="/create-account"
          >Pas encore de compte ?
          <div class="white">S'inscrire</div></NuxtLink
        >
      </h4>
      <h4>
        <NuxtLink to="/dashboard"
          >Continuez sans vous connecter
          <div class="white">ici</div></NuxtLink
        >
      </h4>
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
}
</script>
