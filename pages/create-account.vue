<template>
  <div class="page-create-account">
    <div class="title">Create account</div>
    <div class="form">
      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback prop="username">
          <a-input v-model.number="ruleForm.username" placeholder="Username">
            <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback prop="pass">
          <a-input v-model="ruleForm.pass" type="password" autocomplete="off" placeholder="Password">
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback prop="checkPass">
          <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" placeholder="Repeat password">
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-model-item>
      </a-form-model>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="submitForm('ruleForm')"> Submit </a-button>
        <NuxtLink to="/"><a-button style="margin-left: 10px">Back</a-button></NuxtLink>
      </a-form-model-item>
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
export default {
  layout: 'auth-layout',
  data() {
    const checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Please input an username'))
      }

      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }

        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("Two inputs don't match!"))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        username: '',
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }],
        username: [{ validator: checkUsername, trigger: 'change' }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style scoped>
.page-create-account {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}

.ant-form-item {
  margin-bottom: 0px;
}

.title {
  font-size: 50px;
}

.form {
  margin-top: 30px;
}
</style>
