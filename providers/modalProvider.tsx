"use client"

import { useEffect } from "react"
import { useBoolean } from "usehooks-ts"

import { StoreModal } from "@/components/modals/storeModal"

export const ModalProvider = () => {
    const {value: isMounted, setTrue: setIsMountedTrue} = useBoolean(false)

    useEffect(() => {
        setIsMountedTrue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!isMounted) return null

    return (
        <>
            <StoreModal />
        </>
    )
}