<template>
  <div class="page-update-account">
    <div class="wrapper">
      <div class="accent space-left center">{{ $t('global.eMail') }}</div>
      <div class="ellipsis center">{{ authentication.email }}</div>
      <div>
        <a-button class="accent center" @click="emailVisible = true">{{ $t('global.update') }}</a-button>
        <a-modal
          v-model="emailVisible"
          :title="$t('user-account.email update')"
          class="update-account-data"
          @ok="updateEmail()"
          @cancel="emailVisible = false"
        >
          <a-form-model :form="form" layout="inline">
            <a-form-model-item>
              <a-input v-model="form.email" size="small" :placeholder="$t('global.eMail')" class="field-to-update" />
            </a-form-model-item>
            <a-form-model-item>
              <a-input v-model="form.actualPassword" size="small" :placeholder="$t('global.password')" type="password" class="field-to-update" />
            </a-form-model-item>
            <div class="error-message">{{ errorMessage }}</div>
          </a-form-model>
        </a-modal>
      </div>
      <div class="line"></div>
      <div class="accent space-left center">{{ $t('global.password') }}</div>
      <div class="center">************</div>
      <div>
        <a-button class="accent center" @click="passwordVisible = true">{{ $t('global.update') }}</a-button>
        <a-modal v-model="passwordVisible" :title="$t('user-account.password update')" class="update-account-data" @ok="updatePassword()">
          <a-form-model :form="form" layout="inline">
            <a-form-model-item>
              <a-input
                v-model="form.actualPassword"
                size="small"
                :placeholder="$t('user-account.actual password')"
                type="password"
                class="field-to-update"
              />
            </a-form-model-item>
            <a-form-model-item>
              <a-input
                v-model="form.newPassword"
                size="small"
                :placeholder="$t('user-account.new password')"
                type="password"
                class="field-to-update"
              />
            </a-form-model-item>
            <a-form-model-item>
              <a-input
                v-model="form.repeatPassword"
                size="small"
                :placeholder="$t('user-account.repeat password')"
                type="password"
                class="field-to-update"
              />
            </a-form-model-item>
            <div class="error-message">{{ errorMessage }}</div>
          </a-form-model>
        </a-modal>
      </div>
    </div>
    <div class="suppr-button center">
      <a-button class="suppr-account" @click="deleteAccountVisible = true">{{ $t('user-account.delete account') }}</a-button>
      <a-modal v-model="deleteAccountVisible" :title="$t('user-account.delete account title')" :footer="null" :destroy-on-close="true">
        <i18n tag="p" path="user-account.confirm account deletion">
          <b>{{ $t('global.cannot') }} </b> <b>{{ $t('user-account.confirmation phrase') }} </b>
        </i18n>
        <a-input v-model="deleteAccountText" />
        <p>{{ $t('user-account.enter password') }}</p>
        <a-input v-model="form.actualPassword" type="password" />
        <div class="error-message">{{ errorMessage }}</div>
        <a-button class="button-suppress-account suppr-account" :disabled="suppressAccountButtonDisabled" @click="deleteAccount">{{
          $t('user-account.delete account')
        }}</a-button>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { AUTHENTICATION_GET, AUTHENTICATION_SEND, NAVBAR_SETTINGS } from '~/plugins'
import { Authentication, Navbar, UserUpdate } from '~/models'
import { timeyService } from '~/services'
export default Vue.extend({
  data() {
    return {
      emailVisible: false,
      passwordVisible: false,
      deleteAccountVisible: false,
      errorMessage: '',
      deleteAccountText: '',
      form: {
        email: '',
        actualPassword: '',
        newPassword: '',
        repeatPassword: '',
      },
      authentication: {} as Authentication,
    }
  },
  computed: {
    suppressAccountButtonDisabled(): boolean {
      return this.deleteAccountText !== this.$t('user-account.confirmation phrase').toString()
    },
  },
  beforeMount() {
    on(AUTHENTICATION_SEND, (authentication: Authentication) => {
      this.authentication = authentication
      this.form.email = authentication.email
    })
    emit(AUTHENTICATION_GET)
    emit(NAVBAR_SETTINGS, new Navbar({ title: this.$t('user-account.manage account').toString(), backButton: true }))
  },
  methods: {
    async updateEmail() {
      const user = new UserUpdate({ actualEmail: this.authentication.email, newEmail: this.form.email, actualPassword: this.form.actualPassword })
      await timeyService
        .updateEmail(user)
        .then(() => {
          this.emailVisible = false
          this.form.actualPassword = ''
          this.errorMessage = ''
        })
        .catch((error) => (this.errorMessage = error.message))
    },
    async updatePassword() {
      const user = new UserUpdate({
        actualPassword: this.form.actualPassword,
        newPassword: this.form.newPassword,
        repeatPassword: this.form.repeatPassword,
      })
      await timeyService
        .updatePassword(user)
        .then(() => {
          this.passwordVisible = false
          this.form.actualPassword = ''
          this.form.newPassword = ''
          this.form.repeatPassword = ''
          this.errorMessage = ''
        })
        .catch((error) => (this.errorMessage = error.message))
    },
    async deleteAccount() {
      const user = new UserUpdate({ actualPassword: this.form.actualPassword })
      await timeyService
        .deleteAccount(user)
        .then(() => this.$router.push(this.localePath('/')))
        .catch((error) => (this.errorMessage = error.message))
    },
  },
})
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
  color: var(--danger, red);
}

.center {
  align-self: center;
}

.field-to-update {
  width: 100%;
}

.button-suppress-account {
  margin-top: 0.5rem;
  width: 100%;
}
</style>
