import React, { createContext, useEffect, useState } from 'react'

export const SiteContext = createContext(null)

export function SiteContextProvider({ children }) {
  const [sites, setSites] = useState({
    loading: true,
    isLoggedIn: false,
    sites: []
  })

  const [selectedSite, setSelectedSite] = useState(localStorage.getItem("plausible_docs_site"))

  function selectSite(siteDomain) {
    localStorage.setItem("plausible_docs_site", siteDomain)
    setSelectedSite(siteDomain)
  }

  useEffect(() => {
    async function loadSites() {
      const response = await fetch("/api/sites")

      if (response.status === 200) {
        const { data } = await response.json()
        const dataSites = data.map((site) => site.domain)

        setSites({
          loading: false,
          isLoggedIn: true,
          sites: dataSites
        })

        if (!dataSites.includes(selectedSite)) {
          setSelectedSite(dataSites[0])
        }
      } else {
        setSites({
          loading: false,
          isLoggedIn: false,
          sites: []
        })
      }
    }
    loadSites()
  }, [])


  return (
    <SiteContext.Provider value={{ ...sites, selectedSite, selectSite }}>
      {children}
    </SiteContext.Provider>
  )
}
