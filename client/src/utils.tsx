const server_url = 'http://127.0.0.1:3000';

const request = async (params: object, endpoint: string, method: string) => {
  const response = await fetch(`${server_url}/${endpoint}`, {
    method: method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true'
    },
    body: JSON.stringify(params),
  });
  console.log(response);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

export const create_user = async (username: FormDataEntryValue | null, password: FormDataEntryValue | null, email: FormDataEntryValue | null) => {
  const user_data = {
    user: {
      username: username,
      password: password,
      email: email
    }
  };

  return await request(user_data, 'signup', 'POST');
};
  

export const login_user = async (username: FormDataEntryValue | null, password: FormDataEntryValue | null) => {
  const user_data = {

      username: username,
      password: password,

  };

  return await request(user_data, 'login', 'POST');
};
  
