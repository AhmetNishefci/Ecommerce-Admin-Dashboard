"use client"

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useBoolean } from "usehooks-ts"
import axios from "axios"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CategoryColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alertModal"
import { open } from "inspector"


type CellActionProps = {
    categoryData: CategoryColumn
}

export const CellAction = ({
    categoryData
}: CellActionProps) => {
    const {value: isAlertModalOpen, setFalse: closeAlertModal, setTrue: openAlertModal} = useBoolean(false)
    const {value: isLoading, setTrue: startLoading, setFalse: stopLoading} = useBoolean(false)
    
    const router = useRouter()
    const { storeId } = useParams()

    const handleCopyCategoryId = async (id: string) => {
        try{
            await navigator.clipboard.writeText(id)
            toast.success("Category ID Copied to the clipboard")
        } catch (error) {
            toast.error("Failed to copy ID")
        }
    }

    const handleDeleteCategory = async () => {
        try {
            startLoading()
            await axios.delete(`/api/${storeId}/categories/${categoryData.id}`)
            router.refresh()
            router.push(`/${storeId}/categories`)
            toast.success("Category deleted successfully!")
        } catch (error) {
            toast.error("This category has products, please delete them first!")
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
                onConfirm={handleDeleteCategory}
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
                    <DropdownMenuItem onClick={() => handleCopyCategoryId(categoryData.id)}>
                        <div className="flex items-center hover:text-blue-500 cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" />
                                Copy ID
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${storeId}/categories/${categoryData.id}`)}>
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