<template>
  <div class="page-create-account">
    <div class="title">Create account</div>
    <div class="creation">
      <a-form-model
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        v-bind="layout"
      >
        <a-form-model-item has-feedback label="Username" prop="username">
          <a-input v-model.number="ruleForm.username" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="Password" prop="pass">
          <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="Confirm" prop="checkPass">
          <a-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
          />
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="submit">
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="submitForm('ruleForm')">
          Submit
        </a-button>
        <NuxtLink to="/login"
          ><a-button style="margin-left: 10px">Back</a-button></NuxtLink
        >
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

<style>
.creation {
  position: absolute;
  top: 40%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
}

.submit {
  position: absolute;
  top: 65%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  position: absolute;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
  top: 0%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
}
</style>
