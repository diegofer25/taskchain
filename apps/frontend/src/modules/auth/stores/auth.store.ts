import { auth } from '@/modules/global/services/firebase.service'
import { useAuth } from '@vueuse/firebase'
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const { isAuthenticated, user } = useAuth(auth)

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

  function microsoftSignIn() {
    const provider = new OAuthProvider('microsoft.com')
    provider.addScope('Mail.Read')
    provider.addScope('User.Read')
    provider.addScope('Calendars.ReadWrite')

    return signInWithPopup(auth, provider)
  }

  function signOut() {
    return auth.signOut()
  }
})
