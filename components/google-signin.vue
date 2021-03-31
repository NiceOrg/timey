<template>
  <div class="g-signin2" data-onsuccess="onSignIn"></div>
</template>
<script>
/* eslint-disable */
function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile()
  console.log('ID: ' + profile.getId()) // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName())
  console.log('Given Name: ' + profile.getGivenName())
  console.log('Family Name: ' + profile.getFamilyName())
  console.log('Image URL: ' + profile.getImageUrl())
  console.log('Email: ' + profile.getEmail())

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token
  console.log('ID Token: ' + id_token)
}
export default {
  head() {
    return {
      meta: [
        {
          name: 'google-signin-scope',
          content: 'profile email',
        },
        {
          name: 'google-signin-client_id',
          content: process.env.GOOGLE_CLIENT_ID,
        },
      ],
      script: [
        {
          src: 'https://apis.google.com/js/platform.js',
          defer: true,
          async: true,
        },
      ],
    }
  },
}
</script>
