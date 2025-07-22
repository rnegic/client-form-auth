import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { CreateUserRequest, UpdateUserRequest, LoginRequest } from '@/shared/types';

// Query keys
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string | number) => ['users', id] as const,
  me: ['auth', 'me'] as const,
};

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => apiClient.login(data),
    onSuccess: (response) => {
      localStorage.setItem('token', response.token);
      queryClient.setQueryData(queryKeys.me, response.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      localStorage.removeItem('token');
      queryClient.clear();
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => apiClient.getMe(),
    enabled: !!localStorage.getItem('token'),
  });
};

// Users hooks
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiClient.getUsers(),
  });
};

export const useUser = (id: string | number) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiClient.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUserRequest) => apiClient.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateUserRequest }) =>
      apiClient.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(id) });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string | number) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};
