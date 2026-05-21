import React, { createContext, useContext } from 'react'

interface AppContextType {
  isPremium: boolean
  sidebarExpanded: boolean
  setSidebarExpanded: (value: boolean) => void
}

const AppContext = createContext<AppContextType>({
  isPremium: true,
  sidebarExpanded: true,
  setSidebarExpanded: () => {},
})

export const AppProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <AppContext.Provider
      value={{
        isPremium: true,
        sidebarExpanded: true,
        setSidebarExpanded: () => {},
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
