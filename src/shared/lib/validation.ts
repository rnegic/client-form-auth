import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Некорректный email')
    .required('Email обязателен'),
  password: yup
    .string()
    .min(5, 'Пароль должен содержать минимум 5 символов')
    .required('Пароль обязателен'),
});

export const createUserSchema = yup.object({
  email: yup
    .string()
    .email('Некорректный email')
    .required('Email обязателен'),
  password: yup
    .string()
    .min(5, 'Пароль должен содержать минимум 5 символов')
    .required('Пароль обязателен'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно'),
  firstName: yup
    .string()
    .required('Имя обязательно'),
  lastName: yup
    .string()
    .required('Фамилия обязательна'),
  fullName: yup
    .string()
    .required('Полное имя обязательно'),
});

export const updateUserSchema = yup.object({
  firstName: yup
    .string()
    .required('Имя обязательно'),
  lastName: yup
    .string()
    .required('Фамилия обязательна'),
  fullName: yup
    .string()
    .required('Полное имя обязательно'),
});

export const generateFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};
