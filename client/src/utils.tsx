const server_url = "http://localhost:3001";

const request = async (params: object, endpoint: string, method: string) => {
  try {
    const response = await fetch(`${server_url}/${endpoint}`, {
      method: method,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'      
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const create_user = async (username: FormDataEntryValue | null, password: FormDataEntryValue | null, email: FormDataEntryValue | null) => {
  const user_data = {
    user: {
      username: username,
      password: password,
      email: email
    }
  };

  try {
    return await request(user_data, 'signup', 'POST');
  } catch (error) {
    throw error;
  }
};
  

export const login_user = async (username: FormDataEntryValue | null, password: FormDataEntryValue | null) => {
  const user_data = {
    user: {
      username: username,
      password: password,
    }
  };

  try {
    return await request(user_data, 'login', 'POST');
  } catch (error) {
    throw error;
  }
};
  
