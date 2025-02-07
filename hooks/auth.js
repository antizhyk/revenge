import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                console.log("useSWR", error)
                if (error.response.status !== 409) throw error

                // router.push('/')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        await csrf()
        .catch(error => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        })

        setErrors([])

        return axios
            .post('/register', props)
            .then(() => mutate())
            .then(() => null)
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
                return error.response.data.errors
            })
    }

    const login = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        return axios
            .post('/login', props)
            .then(() => mutate())
            .then(() => null)
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
                return error.response.data.errors
            })
    }

    const updatePassword = async ({ setErrors, setStatus, ...props }) => {
        console.log("updatePassword", props)
        await csrf()

        setErrors([])
        setStatus(null)

        return axios
            .post('/api/users/change-password', props)
            .then(response => setStatus(response.data.status))
            .then(() => null)
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
                return error.response.data.errors
            })

    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        return axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .then(() => null)
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
                return error.response.data.errors
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        return axios
            .post('/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .then(() => null)
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
                return error.response.data.errors
            })
    }

    const resendEmailVerification = async ({ setStatus }) => {
        await csrf()

        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/'
    }

    const getUserSubscription = async () => {
        await csrf()
        return axios.get('/api/subscriptions/user')
        .then(response => response.data.data)
        .catch(error => {
            if (error.response.status !== 422) throw error
            return error.response.data.errors
        })
    }

    const googleLogin = async (token) => {
        await csrf()
        return axios.get(`/api/google-auth?token=${token}`)
        .then(response => response.data.data)
        .catch(error => {
            if (error.response.status !== 422) throw error
            return error.response.data.errors
        })
    }
    
    const cancelSubscription = async () => {
        await csrf()
        return axios.post('/api/subscription/cancel')
        .then(response => response.data.data)
        .catch(error => {
            if (error.response.status !== 422) throw error
            return error.response.data.errors
        })
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        // if (middleware === 'auth' && !user?.email_verified_at)
        //     router.push('/verify-email')
        
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        updatePassword,
        getUserSubscription,
        cancelSubscription,
        googleLogin
    }
}
