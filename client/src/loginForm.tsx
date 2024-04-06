// import * as React from 'react';
import { login_user } from './utils';
import { useState } from 'react';
import { CredentialsForm } from './credentialsForm';
import { useNavigate } from 'react-router-dom';


export default function LogIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await login_user(username, password);
    console.log(result);
    if (!result.onboarded) navigate(`/information/${result.id}`);
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
    }
  ];

  return <CredentialsForm params={params} buttonText='Вход' handleSubmit={handleSubmit} />;
}
