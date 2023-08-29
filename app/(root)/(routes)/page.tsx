"use client"

import { useEffect } from "react"

import { useStoreModal } from "@/hooks/useStoreModal";

const SetupPage = () => {
    const { isStoreModalOpen, openStoreModal } = useStoreModal()

    useEffect(() => {
        if (!isStoreModalOpen) {
            openStoreModal()
        }
    }, [ isStoreModalOpen, openStoreModal ])

    return null
  }

export default SetupPage;
  