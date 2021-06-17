<template>
  <div class="page-update-account">
    <div class="wrapper">
      <div class="accent space-left center">E-mail</div>
      <div class="ellipsis center">{{ email }}</div>
      <div>
        <a-button class="accent center" @click="emailVisible = true">Modifier</a-button>
        <a-modal v-model="emailVisible" title="Modification email" class="update-account-data" @ok="updateEmail()" @cancel="emailVisible = false">
          <a-form-model :form="form" layout="inline">
            <a-form-model-item>
              <a-input v-model="form.email" size="small" placeholder="email" class="field-to-update" />
            </a-form-model-item>
            <a-form-model-item>
              <a-input v-model="form.actualPassword" size="small" placeholder="Actual password" type="password" class="field-to-update" />
            </a-form-model-item>
            <div class="error-message">{{ errorMessage }}</div>
          </a-form-model>
        </a-modal>
      </div>
      <div class="line"></div>
      <div class="accent space-left center">Mot de passe</div>
      <div class="center">************</div>
      <div>
        <a-button class="accent center" @click="PasswordVisible = true">Modifier</a-button>
        <a-modal v-model="PasswordVisible" title="Modification du mot de passe" class="update-account-data" @ok="updatePassword()">
          <a-form-model :form="form" layout="inline">
            <a-form-model-item>
              <a-input v-model="form.actualPassword" size="small" placeholder="Actual password" type="password" class="field-to-update" />
            </a-form-model-item>
            <a-form-model-item>
              <a-input v-model="form.newPassword" size="small" placeholder="New password" type="password" class="field-to-update" />
            </a-form-model-item>
            <a-form-model-item>
              <a-input v-model="form.repeatPassword" size="small" placeholder="Validate new password" type="password" class="field-to-update" />
            </a-form-model-item>
            <div class="error-message">{{ errorMessage }}</div>
          </a-form-model>
        </a-modal>
      </div>
    </div>
    <div class="suppr-button center">
      <a-button class="suppr-account">Supprimer compte</a-button>
    </div>
  </div>
</template>

<script>
import { emit } from 'shuutils'
import { authenticationPlugin, NAVBAR_SETTINGS, userPlugin } from '~/plugins'
import { Navbar, UserUpdate } from '~/models'
import { timeyService } from '~/services'
export default {
  data() {
    return {
      email: '',
      emailVisible: false,
      PasswordVisible: false,
      errorMessage: '',
      form: {
        email: '',
        actualPassword: '',
        newPassword: '',
        repeatPassword: '',
      },
    }
  },
  beforeMount() {
    emit(NAVBAR_SETTINGS, new Navbar({ title: 'Gérer compte', backButton: true }))

    this.email = userPlugin.getUser().email
    this.form.email = this.email
  },
  methods: {
    async updateEmail() {
      const user = new UserUpdate({ _id: authenticationPlugin.get().id, email: this.form.email, actualPassword: this.form.actualPassword })
      await timeyService
        .updateEmail(user)
        .catch((error) => (this.errorMessage = error.message))
        .then((this.emailVisible = false))
    },
    updatePassword() {
      console.log('save in back passwd', this.form.actualPassword, this.form.newPassword, this.form.repeatPassword)
      timeyService.updatePassword()
    },
  },
}
</script>

<style scoped>
.page-update-account {
  margin: 1.5rem 0.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 1.5rem;
  grid-row-gap: 0.5rem;
  padding: 0.5rem 0;
  margin: 0.3rem 0.6rem;
  border: 0.1rem solid var(--accent, gray);
  border-radius: 0.3rem;
}

.line {
  grid-column: 1 / -1;
  border-top: 0.1rem solid var(--accent, gray);
}

.space-left {
  padding-left: 0.5rem;
}

.space-right {
  padding-right: 0.5rem;
}

.accent {
  font-weight: 600;
}

.suppr-button {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.suppr-account {
  color: red;

  /* zoiakejfjeoizkfjk */
}

.center {
  align-self: center;
}

.field-to-update {
  width: 100%;
}
</style>
