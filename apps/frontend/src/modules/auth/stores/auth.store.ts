import { auth } from '@/modules/global/services/firebase.service'
import type { User } from 'firebase/auth'
import { getIdTokenResult, GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  auth.onAuthStateChanged((_user) => (user.value = _user))

  return {
    isAuthenticated,
    user,
    googleSignIn,
    microsoftSignIn,
    signOut,
  }

  function googleSignIn() {
    return signInWithPopup(auth, new GoogleAuthProvider())
  }

  async function microsoftSignIn() {
    const provider = new OAuthProvider('microsoft.com')
    provider.addScope('Mail.Read')
    provider.addScope('User.Read')
    provider.addScope('Calendars.ReadWrite')

    const response = await signInWithPopup(auth, provider)

    console.log('Microsoft sign-in response:', response)

    setTimeout(() => {
      getIdTokenResult(response.user)
        .then((token) => {
          console.log('Token:', token)
        })
        .catch((error) => {
          console.error('Error fetching token:', error)
        })
    }, 3000)
  }

  function signOut() {
    return auth.signOut()
  }

  // async function fetchMsUserProfilePicture(token: string) {
  //   const photoResp = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //   return photoResp.blob()
  // }
})
