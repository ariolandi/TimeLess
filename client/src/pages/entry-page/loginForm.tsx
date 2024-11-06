import { UserService } from "../../services/userService";
import { useState } from "react";
import { CredentialsForm } from "../../components/credentialsForm";
import { useNavigate } from "react-router-dom";
import { InputParams } from "../../components/inputField";

const userService = new UserService();

export default function LogIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await userService.login({username, password});

    if(result) {
      localStorage.setItem("current_user", result.data.token);
      navigate(result.data.onboarded ? '/dashboard' : '/information');
    } else {
      setErrorText("Невалидни потребителски данни");
    }
  };

  const params: InputParams[] = [
    {
      name: "username",
      value: username,
      state: setUsername,
      label: "Потребителско име",
      required: true,
    },
    {
      name: "password",
      value: password,
      state: setPassword,
      label: "Парола",
      type: "password",
      required: true,
    },
  ];

  return (
    <CredentialsForm
      params={params}
      buttonText="Вход"
      errorText={errorText}
      onSubmit={handleSubmit}
    />
  );
}
