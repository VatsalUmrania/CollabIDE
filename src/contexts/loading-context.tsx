'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingState {
  [key: string]: boolean
}

interface LoadingContextType {
  isLoading: (key?: string) => boolean
  setLoading: (key: string, loading: boolean) => void
  withLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>
  globalLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({})

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key] || false
    }
    return Object.values(loadingStates).some(Boolean)
  }, [loadingStates])

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => {
      if (loading) {
        return { ...prev, [key]: true }
      } else {
        const { [key]: _, ...rest } = prev
        return rest
      }
    })
  }, [])

  const withLoading = useCallback(async <T,>(key: string, fn: () => Promise<T>): Promise<T> => {
    setLoading(key, true)
    try {
      return await fn()
    } finally {
      setLoading(key, false)
    }
  }, [setLoading])

  const globalLoading = Object.values(loadingStates).some(Boolean)

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, withLoading, globalLoading }}>
      {children}
      {globalLoading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
