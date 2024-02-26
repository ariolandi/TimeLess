// import * as React from 'react';
import { create_user } from './utils';
import { useState } from 'react';
import { CredentialsForm } from './credentialsForm';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await create_user(username, password, email);
    navigate(`/information/42`);
  };

  const params = [
    {
      name: 'username',
      value: username,
      state: setUsername,
      label: 'Потребителско име',
      type: ''
    },
    {
      name: 'password',
      value: password,
      state: setPassword,
      label: 'Парола',
      type: 'password'
    },
    {
      name: 'email',
      value: email,
      state: setEmail,
      label: 'Имейл',
      type: 'email'
    }
  ];

  return <CredentialsForm params={params} buttonText='Регистрация' handleSubmit={handleSubmit} />;
}
