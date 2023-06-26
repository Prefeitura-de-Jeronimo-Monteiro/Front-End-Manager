import api from "@/shared/services";
import { AxiosResponse } from "axios";
import React, { createContext, useEffect, useState } from "react";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { RegisterUser } from "@/shared/services/User/create.service";
import Router from "next/router";
import { IUser } from "@/shared/interfaces/UserData";
import { getUserDataById } from "@/shared/services/User/view.service";

interface AuthContextData {
  user: IUser;
  login: (data: IAuthData) => Promise<AxiosResponse>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser>({});

  useEffect(() => {
    const { Id: id } = parseCookies();

    if (id) {
      getUserDataById(id)
        .then((res) => {
          console.log(res);

          setUser({
            name: res.data.name,
            email: res.data.email,
            id: res.data.id,
          });
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = async ({ email, password }: IAuthData) => {
    const requestLogin = await api.post("login", {
      email,
      password,
    });

    if (requestLogin.status === 200) {
      const token = requestLogin.data.access_token;
      const id = requestLogin.data.user.id;

      setCookie(undefined, "BearerToken", token, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      setCookie(undefined, "Id", id, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      setUser({
        name: requestLogin.data.user.name,
        email: requestLogin.data.user.email,
        id: requestLogin.data.user.id,
      });
    }

    return requestLogin;
  };

  const logout = async () => {
    destroyCookie(null, "BearerToken", {
      path: "/",
    });

    destroyCookie(undefined, "Id", {
      path: "/",
    });

    await Router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
