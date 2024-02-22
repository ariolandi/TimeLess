// import * as React from 'react';
import { create_user } from './utils';
import { useState } from 'react';
import { CredentialsForm } from './credentialsForm';



export default function SignUp() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    create_user(data.get('username'), data.get('password'), data.get('email')).then(_ => 
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      })
    ).catch(err => 
      console.log(err.message)
    );
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

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