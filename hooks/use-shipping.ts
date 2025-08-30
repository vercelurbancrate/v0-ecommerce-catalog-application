"use client"

import { useState, useEffect } from 'react'

export interface ShippingInfo {
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

const defaultShippingInfo: ShippingInfo = {
  name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: ''
}

export function useShipping() {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(defaultShippingInfo)

  // Load shipping info from localStorage on mount
  useEffect(() => {
    const savedShippingInfo = localStorage.getItem('urbancrate-shipping')
    if (savedShippingInfo) {
      setShippingInfo(JSON.parse(savedShippingInfo))
    }
  }, [])

  // Save shipping info to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('urbancrate-shipping', JSON.stringify(shippingInfo))
  }, [shippingInfo])

  const clearShippingInfo = () => {
    setShippingInfo(defaultShippingInfo)
  }

  return {
    shippingInfo,
    setShippingInfo,
    clearShippingInfo
  }
}
