import api from "@/shared/services";
import {AxiosResponse} from "axios";
import React, {createContext, useEffect, useState} from "react";
import {destroyCookie, parseCookies, setCookie} from "nookies";
import Router from "next/router";
import {IUser} from "@/shared/interfaces/UserData";
import {getUserDataById} from "@/shared/services/User/view.service";

interface AuthContextData {
  user: IUser;
  login: (data: IAuthData) => Promise<AxiosResponse>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState<IUser>({});

  useEffect(() => {
    const {Id: id} = parseCookies();

    if (id) {
      getUserDataById(id)
        .then((res) => {
          setUser({
            name: res.data.retorno.nome,
            sobrenome: res.data.retorno.sobrenome,
            id: res.data.retorno.id,
          });
        })
        .catch(() => {
          logout();
        });
    } else {
      logout();
    }
  }, []);

  const login = async ({usuario, senha}: IAuthData) => {
    const requestLogin = await api().post("autenticacao", {
      usuario,
      senha,
    });

    if (requestLogin.status === 200) {
      const token = requestLogin.data.token;
      const id = requestLogin.data.userData.id;

      setCookie(undefined, "BearerToken", token, {
        maxAge: 60 * 60 * 3,
        path: "/",
      });

      setCookie(undefined, "Id", id, {
        maxAge: 60 * 60 * 3,
        path: "/",
      });

      setUser({
        name: requestLogin.data.userData.nome,
        sobrenome: requestLogin.data.userData.sobrenome,
        id: requestLogin.data.userData.id,
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

    await Router.push("/user/login");
  };

  return (
    <AuthContext.Provider value={{login, logout, user}}>
      {children}
    </AuthContext.Provider>
  );
};
