"use client"

import { useEffect } from "react"
import { useBoolean } from "usehooks-ts"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"

type AlertModalProps = {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}

export const AlertModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}: AlertModalProps) => {
    const {value: isMounted, setTrue: setMountedTrue} = useBoolean(false)

    useEffect(() => {
        setMountedTrue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if(!isMounted){
        return null
    }

    return (
        <Modal
            title="Are you sure?"
            description="This action cannot be undone!"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} variant="destructive" onClick={onConfirm}>
                    Continue
                </Button>
            </div>
        </Modal>
    )
}