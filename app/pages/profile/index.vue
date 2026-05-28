<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const {
  data,
  password,
  dataErrors,
  passwordErrors,
  pending,
  avatarSrc,
  saveAvatar,
  saveData,
  savePassword,
  clearDataError,
  clearPasswordError,
} = useProfilePage()
</script>

<template>
  <div class="flex flex-col gap-10">
    <Profile
        :avatar-src="avatarSrc"
        :error="dataErrors.avatar"
        @select-avatar="saveAvatar"
    />

    <ProfileActions />

    <ProfileDataForm
        :name="data.name"
        :email="data.email"
        :errors="dataErrors"
        :pending="pending"
        @update:name="data.name = $event"
        @update:email="data.email = $event"
        @clear-error="clearDataError"
        @submit="saveData"
    />

    <div class="h-px bg-gradient-to-r from-gtr-soft to-transparent"></div>

    <ProfilePasswordForm
        :current-password="password.current_password"
        :password="password.password"
        :password-confirmation="password.password_confirmation"
        :errors="passwordErrors"
        :pending="pending"
        @update:current-password="password.current_password = $event"
        @update:password="password.password = $event"
        @update:password-confirmation="password.password_confirmation = $event"
        @clear-error="clearPasswordError"
        @submit="savePassword"
    />
  </div>
</template>