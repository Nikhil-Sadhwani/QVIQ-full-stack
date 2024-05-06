import React, { createContext, useState } from "react";

interface ProviderProps {
  children: React.ReactNode;
}

interface ValuesProperty {
  value: Record<string, any>;
  setValue: (obj: Record<string, any>) => void;
}

export const userContext = createContext<ValuesProperty | null>(null);

export const UserContextProvider: React.FC<ProviderProps> = (props) => {
  const [userInfo, setUserInfo] = useState({});
  return (
    <userContext.Provider
      value={{
        value: userInfo,
        setValue: setUserInfo,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};
