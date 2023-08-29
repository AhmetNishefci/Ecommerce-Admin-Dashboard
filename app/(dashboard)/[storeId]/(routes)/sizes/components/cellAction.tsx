"use client"

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useBoolean } from "usehooks-ts"
import axios from "axios"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SizesColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alertModal"

type CellActionProps = {
    sizesData: SizesColumn
}

export const CellAction = ({
    sizesData
}: CellActionProps) => {
    const {value: isAlertModalOpen, setFalse: closeAlertModal, setTrue: openAlertModal} = useBoolean(false)
    const {value: isLoading, setTrue: startLoading, setFalse: stopLoading} = useBoolean(false)
    
    const router = useRouter()
    const { storeId } = useParams()

    const handleCopySizeId = async (id: string) => {
        try{
            await navigator.clipboard.writeText(id)
            toast.success("Size ID Copied to the clipboard")
        } catch (error) {
            toast.error("Failed to copy ID")
        }
    }

    const handleDeleteSize = async () => {
        try {
            startLoading()
            await axios.delete(`/api/${storeId}/sizes/${sizesData.id}`)
            router.refresh()
            router.push(`/${storeId}/sizes`)
            toast.success("Size deleted successfully!")
        } catch (error) {
            toast.error("This size has products using it, please delete them first!")
        } finally {
            stopLoading()
            closeAlertModal()
        }
    }
    return (
        <>
            <AlertModal 
                isOpen={isAlertModalOpen}
                onClose={closeAlertModal}
                onConfirm={handleDeleteSize}
                loading={isLoading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">
                            Open Menu
                        </span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleCopySizeId(sizesData.id)}>
                        <div className="flex items-center hover:text-blue-500 cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" />
                                Copy ID
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${storeId}/sizes/${sizesData.id}`)}>
                        <div className="flex items-center hover:text-blue-500 cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                                Update
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={openAlertModal}>
                        <div className="flex items-center hover:text-blue-500 cursor-pointer">
                            <Trash className="mr-2 h-4 w-4" />
                                Delete
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}