import { createContext, useState, useContext } from "react";

const ConfiguratorContext = createContext();

export const ConfiguratorProvider = ({ children }) => {
  const [legs, setLegs] = useState(0);
  const [tableWidth, setTableWidth] = useState(100);
  const [legsColor, setLegsColor] = useState("");
  return (
    <ConfiguratorContext.Provider
      value={{ legs, setLegs, tableWidth, setTableWidth, legsColor, setLegsColor }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => {
  return useContext(ConfiguratorContext);
};
