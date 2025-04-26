import { auth } from '@/modules/global/services/firebase.service'
import { useStorage } from '@vueuse/core'
import type { OAuthCredential, User } from 'firebase/auth'
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const storedMsOAuthCredential = useStorage<OAuthCredential>(
    'msAccessToken',
    {} as OAuthCredential,
  )
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const firstName = computed(() => user.value?.displayName?.split(' ')[0] || '')
  const lastName = computed(() => user.value?.displayName?.split(' ')[1] || '')

  auth.onAuthStateChanged(async (_user) => {
    if (_user) {
      user.value = _user

      // if (
      //   _user.providerData[0]?.providerId === 'microsoft.com' &&
      //   storedMsOAuthCredential.value.accessToken
      // ) {
      //   try {
      //     const photoURL = await fetchMsUserProfilePicture(
      //       storedMsOAuthCredential.value.accessToken,
      //     )
      //     setUser({ ..._user, photoURL })
      //   } catch (error) {
      //     console.error('Error fetching Microsoft user profile picture:', error)
      //   }
      // }
    }
  })

  return {
    isAuthenticated,
    user,
    firstName,
    lastName,
    googleSignIn,
    microsoftSignIn,
    signOut,
  }

  function setUser(_user: User | null) {
    user.value = _user
  }

  function googleSignIn() {
    return signInWithPopup(auth, new GoogleAuthProvider())
  }

  async function microsoftSignIn() {
    const provider = new OAuthProvider('microsoft.com')
    provider.addScope('Mail.Read')
    provider.addScope('User.Read')
    provider.addScope('Calendars.ReadWrite')

    return signInWithPopup(auth, provider)
    // const credential = OAuthProvider.credentialFromResult(response)

    // if (credential && credential.accessToken) {
    //   storedMsOAuthCredential.value = credential

    //   const photoURL = await fetchMsUserProfilePicture(credential.accessToken)
    //   setUser({ ...response.user, photoURL })
    // }
  }

  async function signOut() {
    await auth.signOut()
    storedMsOAuthCredential.value = {} as OAuthCredential
    setUser(null)
  }

  // async function fetchMsUserProfilePicture(token: string) {
  //   try {
  //     const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })

  //     if (response.status === 401) {
  //       const _token = await refreshMicrosoftToken()

  //       if (!_token) {
  //         throw new Error('Failed to refresh Microsoft token')
  //       }
  //       console.log('Token refreshed successfully')
  //       return await fetchMsUserProfilePicture(_token)
  //     } else if (!response.ok) {
  //       console.error('Error fetching Microsoft user profile picture:', response)
  //       throw new Error(`HTTP error! status: ${response.status}`)
  //     }

  //     const blob = await response.blob()
  //     return URL.createObjectURL(blob)
  //   } catch (error) {
  //     console.log('Error fetching Microsoft user profile picture:')
  //     console.error(error)

  //     return null
  //   }
  // }

  // async function refreshMicrosoftToken(): Promise<string | null> {
  //   if (!auth.currentUser) return null

  //   const provider = new OAuthProvider('microsoft.com')
  //   provider.addScope('Mail.Read')
  //   provider.addScope('User.Read')
  //   provider.addScope('Calendars.ReadWrite')

  //   const response = await reauthenticateWithPopup(auth.currentUser, provider)
  //   const credential = OAuthProvider.credentialFromResult(response)

  //   if (credential?.accessToken) {
  //     storedMsOAuthCredential.value = credential
  //     return credential.accessToken
  //   }
  //   return null
  // }
})
