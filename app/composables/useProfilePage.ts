import {z} from 'zod'
import type {ErrorResponse} from '~/types/api'

type DataErrorKey = 'name' | 'email' | 'avatar'
type PasswordErrorKey = 'current_password' | 'password' | 'password_confirmation'

export const useProfilePage = () => {
  const toast = useToast()
  const {user, actionPending, updateProfile, updateAvatar, updatePassword} = useAuth()

  const avatarPreview = ref<string | null>(null)

  const data = reactive({
    name: '',
    email: '',
  })

  const password = reactive({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const dataErrors = reactive<Record<DataErrorKey, string>>({
    name: '',
    email: '',
    avatar: '',
  })

  const passwordErrors = reactive<Record<PasswordErrorKey, string>>({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const dataSchema = z.object({
    name: z.string().trim().min(1, 'Введите имя').max(255, 'Максимум 255 символов'),
    email: z.string().trim().min(1, 'Введите email').email('Некорректный email').max(255, 'Максимум 255 символов'),
  })

  const passwordSchema = z.object({
    current_password: z.string().min(1, 'Введите текущий пароль'),
    password: z.string().min(8, 'Минимум 8 символов'),
    password_confirmation: z.string().min(1, 'Повторите новый пароль'),
  }).refine(value => value.password === value.password_confirmation, {
    message: 'Пароли не совпадают',
    path: ['password_confirmation'],
  })

  const avatarSrc = computed(() => {
    return avatarPreview.value || user.value?.avatar || null
  })

  const clearDataError = (field: DataErrorKey) => {
    dataErrors[field] = ''
  }

  const clearPasswordError = (field: PasswordErrorKey) => {
    passwordErrors[field] = ''
  }

  const clearDataErrors = () => {
    Object.keys(dataErrors).forEach(key => {
      dataErrors[key as DataErrorKey] = ''
    })
  }

  const clearPasswordErrors = () => {
    Object.keys(passwordErrors).forEach(key => {
      passwordErrors[key as PasswordErrorKey] = ''
    })
  }

  const fillDataErrors = (errors?: Record<string, string[]>) => {
    if (!errors) return

    Object.entries(errors).forEach(([key, messages]) => {
      if (!(key in dataErrors)) return

      const message = messages[0] ?? ''

      dataErrors[key as DataErrorKey] = message === 'validation.uploaded'
          ? 'Файл не загрузился. Выберите изображение меньше 2 МБ'
          : message
    })
  }

  const fillPasswordErrors = (errors?: Record<string, string[]>) => {
    if (!errors) return

    Object.entries(errors).forEach(([key, messages]) => {
      if (!(key in passwordErrors)) return

      passwordErrors[key as PasswordErrorKey] = messages[0] ?? ''
    })
  }

  const validateData = () => {
    clearDataErrors()

    const result = dataSchema.safeParse(data)

    if (!result.success) {
      result.error.issues.forEach(err => {
        const key = err.path[0] as DataErrorKey
        dataErrors[key] = err.message
      })

      return false
    }

    return true
  }

  const validatePassword = () => {
    clearPasswordErrors()

    const result = passwordSchema.safeParse(password)

    if (!result.success) {
      result.error.issues.forEach(err => {
        const key = err.path[0] as PasswordErrorKey
        passwordErrors[key] = err.message
      })

      return false
    }

    return true
  }

  const validateAvatar = (file: File) => {
    dataErrors.avatar = ''

    if (!file.type.startsWith('image/')) {
      dataErrors.avatar = 'Выберите изображение'
      return false
    }

    if (file.size > 2 * 1024 * 1024) {
      dataErrors.avatar = 'Максимальный размер файла — 2 МБ'
      return false
    }

    return true
  }

  const setAvatarPreview = (file: File) => {
    if (avatarPreview.value) {
      URL.revokeObjectURL(avatarPreview.value)
    }

    avatarPreview.value = URL.createObjectURL(file)
  }

  const resetAvatarPreview = () => {
    if (avatarPreview.value) {
      URL.revokeObjectURL(avatarPreview.value)
      avatarPreview.value = null
    }
  }

  const saveAvatar = async (file: File) => {
    if (!validateAvatar(file) || actionPending.value) return

    setAvatarPreview(file)

    try {
      await updateAvatar(file)

      resetAvatarPreview()

      toast.add({
        title: 'Аватар обновлен',
        color: 'success',
      })
    } catch (e) {
      const error = e as ErrorResponse

      resetAvatarPreview()
      fillDataErrors(error.errors)

      toast.add({
        title: 'Не удалось обновить фото',
        description: 'Выберите другое изображение и попробуйте еще раз',
        color: 'error',
      })
    }
  }

  const saveData = async () => {
    if (!validateData() || actionPending.value) return

    try {
      await updateProfile({
        name: data.name.trim(),
        email: data.email.trim(),
      })

      toast.add({
        title: 'Профиль обновлен',
        color: 'success',
      })
    } catch (e) {
      const error = e as ErrorResponse

      fillDataErrors(error.errors)

      toast.add({
        title: 'Не удалось сохранить профиль',
        description: 'Проверьте данные и попробуйте еще раз',
        color: 'error',
      })
    }
  }

  const savePassword = async () => {
    if (!validatePassword() || actionPending.value) return

    try {
      await updatePassword({
        current_password: password.current_password,
        password: password.password,
        password_confirmation: password.password_confirmation,
      })

      Object.assign(password, {
        current_password: '',
        password: '',
        password_confirmation: '',
      })

      clearPasswordErrors()

      toast.add({
        title: 'Пароль изменен',
        color: 'success',
      })
    } catch (e) {
      const error = e as ErrorResponse

      fillPasswordErrors(error.errors)

      if (error.status === 422 && !Object.values(passwordErrors).some(Boolean)) {
        passwordErrors.current_password = 'Неверный текущий пароль'
      }

      toast.add({
        title: 'Не удалось изменить пароль',
        description: 'Проверьте данные и попробуйте еще раз',
        color: 'error',
      })
    }
  }

  watch(user, value => {
    if (!value) return

    data.name = value.name ?? ''
    data.email = value.email ?? ''
  }, {immediate: true})

  onBeforeUnmount(() => {
    resetAvatarPreview()
  })

  return {
    data,
    password,
    dataErrors,
    passwordErrors,
    pending: actionPending,
    avatarSrc,
    saveAvatar,
    saveData,
    savePassword,
    clearDataError,
    clearPasswordError,
  }
}