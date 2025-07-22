import { Table, Button, Group, Text, Title, ActionIcon, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUsers, useDeleteUser } from '@/shared/lib';
import type { User } from '@/shared/types';
import styles from './HomePage.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const { data: users, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();
  const [opened, { open, close }] = useDisclosure(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleEdit = (id: string | number) => {
    navigate(`/user/edit/${id}`);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    open();
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser.mutateAsync(userToDelete.id);
      notifications.show({
        title: 'Успешно',
        message: 'Пользователь удален',
        color: 'green',
      });
      close();
      setUserToDelete(null);
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить пользователя',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return <Text>Загрузка...</Text>;
  }

  if (error) {
    return <Text c="red">Ошибка загрузки данных</Text>;
  }

  return (
    <>
      <div className={styles.container}>
        <Group justify="space-between" mb="xl">
          <Title order={2}>Пользователи</Title>
          <Button onClick={() => navigate('/user/create')}>
            Создать пользователя
          </Button>
        </Group>

        {users && users.length > 0 ? (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Имя</Table.Th>
                <Table.Th>Фамилия</Table.Th>
                <Table.Th>Полное имя</Table.Th>
                <Table.Th>Должность</Table.Th>
                <Table.Th>Дата создания</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>{user.id}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>{user.name}</Table.Td>
                  <Table.Td>{user.surName}</Table.Td>
                  <Table.Td>{user.fullName}</Table.Td>
                  <Table.Td>{user.employment || '-'}</Table.Td>
                  <Table.Td>
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : '-'
                    }
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEdit(user.id)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Text ta="center" c="dimmed" size="lg">
            Пользователи не найдены
          </Text>
        )}
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title="Подтверждение удаления"
        centered
      >
        <Text mb="md">
          Вы уверены, что хотите удалить пользователя{' '}
          <strong>{userToDelete?.fullName}</strong>?
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>
            Отмена
          </Button>
          <Button
            color="red"
            onClick={handleDeleteConfirm}
            loading={deleteUser.isPending}
          >
            Удалить
          </Button>
        </Group>
      </Modal>
    </>
  );
}
