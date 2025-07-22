import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Title, TextInput, Button, Stack, Group, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { notifications } from '@mantine/notifications';
import { useUser, useUpdateUser } from '@/shared/lib';
import { updateUserSchema, generateFullName } from '@/shared/lib/validation';
import type { UpdateUserRequest } from '@/shared/types';
import styles from './EditUserPage.module.css';

export function EditUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = id || '';
  
  const { data: user, isLoading, error } = useUser(userId);
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<UpdateUserRequest>({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      fullName: '',
    },
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.name,
        lastName: user.surName,
        fullName: user.fullName,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (firstName || lastName) {
      const fullName = generateFullName(firstName, lastName);
      setValue('fullName', fullName);
    }
  }, [firstName, lastName, setValue]);

  const onSubmit = async (data: UpdateUserRequest) => {
    try {
      await updateUser.mutateAsync({ id: userId, data });
      notifications.show({
        title: 'Успешно',
        message: 'Пользователь обновлен',
        color: 'green',
      });
      navigate('/');
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить пользователя',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return <Text>Загрузка...</Text>;
  }

  if (error || !user) {
    return <Text c="red">Пользователь не найден</Text>;
  }

  return (
    <div className={styles.container}>
      <Container size="md">
        <Paper withBorder shadow="md" p={30} radius="md">
          <Title order={2} mb="xl" ta="center">
            Редактирование пользователя
          </Title>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                value={user.email}
                disabled
                description="Email нельзя изменить"
              />

              <Group grow>
                <TextInput
                  label="Имя"
                  placeholder="Иван"
                  required
                  {...register('firstName')}
                  error={errors.firstName?.message}
                />

                <TextInput
                  label="Фамилия"
                  placeholder="Иванов"
                  required
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
              </Group>

              <TextInput
                label="Полное имя"
                placeholder="Иван Иванов"
                required
                {...register('fullName')}
                error={errors.fullName?.message}
              />

              <Group justify="flex-end" mt="xl">
                <Button variant="default" onClick={() => navigate('/')}>
                  Отмена
                </Button>
                <Button
                  type="submit"
                  loading={updateUser.isPending}
                >
                  Сохранить
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
