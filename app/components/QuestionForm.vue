<script lang="ts" setup>
import {z} from 'zod'
import type {StoreQuestionPayload} from "~/types/question";

const toast = useToast();
const {storeQuestion} = useQuestionApi();

const getDefaultValue = (): StoreQuestionPayload => ({
  name: '',
  phone: '',
  email: '',
  message: '',
});

const form = reactive<StoreQuestionPayload>(getDefaultValue());
const errors = reactive<Record<keyof StoreQuestionPayload, string>>(getDefaultValue());

const schema = z.object({
  name: z.string().trim().min(1, 'Введите имя'),
  phone: z.string().regex(/^\d+$/, 'Некорректный номер телефона'),
  email: z.string().trim().email('Некорректный email'),
  message: z.string().trim().min(1, 'Введите сообщение'),
})

const pending = ref(false)

const validate = () => {
  clearErrors();

  const result = schema.safeParse(form);

  if (!result.success) {
    result.error.issues.forEach(err => {
      const key = err.path[0] as keyof typeof errors;
      errors[key] = err.message;
    });

    return false;
  }

  return true;
};

const submitForm = async () => {
  if (!validate()) return

  pending.value = true;

  try {
    await storeQuestion(form);

    toast.add({
      title: 'Сообщение отправлено',
      description: 'Мы свяжемся с вами в ближайшее время',
      color: 'success'
    });

    clearErrors();
    clearForm();

  } catch (error) {
    toast.add({
      title: 'Ошибка отправки',
      description: 'Попробуйте позже',
      color: 'error'
    })
  } finally {
    pending.value = false;
  }
}

const clearErrors = () => {
  Object.assign(errors, getDefaultValue());
};

const clearForm = () => {
  Object.assign(form, getDefaultValue());
};

const {user} = useAuth();

watchEffect(() => {
  if (user.value) {
    form.name = user.value.name ?? ''
    form.email = user.value.email ?? ''
  }
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="text-center">
      <p class="text-2xl font-semibold mb-2">Свяжитесь с нами</p>
      <p>Заполните форму ниже, и мы ответим вам в ближайшее время</p>
    </div>
    <div class="flex flex-col gap-8 max-w-2xl w-full m-auto">
      <div class="flex flex-col gap-2">
        <label>Имя</label>
        <u-input
            v-model="form.name"
            :ui="{ base: `rounded-none border-b border-gtr-toned focus:border-gtr-highlight ring-0 focus-visible:ring-0 text-md ${errors.name ? 'border-red-500' : ''}` }"
            @update:model-value="errors.name = ''"
        ></u-input>
        <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label>Номер телефона</label>
        <u-input
            v-model="form.phone"
            :ui="{ base: `rounded-none border-b border-gtr-toned focus:border-gtr-highlight ring-0 focus-visible:ring-0 text-md ${errors.phone ? 'border-red-500' : ''}` }"
            @update:model-value="errors.phone = ''"
        ></u-input>
        <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label>Электронная почта</label>
        <u-input
            v-model="form.email"
            :ui="{ base: `rounded-none border-b border-gtr-toned focus:border-gtr-highlight ring-0 focus-visible:ring-0 text-md ${errors.email ? 'border-red-500' : ''}` }"
            @update:model-value="errors.email = ''"
        ></u-input>
        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label>Вопрос</label>
        <u-textarea
            v-model="form.message"
            :ui="{ base: `rounded-none border-b border-gtr-toned focus:border-gtr-highlight ring-0 focus-visible:ring-0 text-md ${errors.message ? 'border-red-500' : ''}` }"
            @update:model-value="errors.message = ''"
        ></u-textarea>
        <p v-if="errors.message" class="text-red-500 text-sm">{{ errors.message }}</p>
      </div>
    </div>
    <div class="flex justify-center">
      <u-button :loading="pending" class="flex items-center px-6" variant="ghost" @click="submitForm">
        Отправить
      </u-button>
    </div>
  </div>
</template>