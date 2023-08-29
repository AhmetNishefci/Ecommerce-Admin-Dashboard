"use client"

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useBoolean } from "usehooks-ts"
import axios from "axios"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProductColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alertModal"

type CellActionProps = {
    productData: ProductColumn
}

export const CellAction = ({
    productData
}: CellActionProps) => {
    const {value: isAlertModalOpen, setFalse: closeAlertModal, setTrue: openAlertModal} = useBoolean(false)
    const {value: isLoading, setTrue: startLoading, setFalse: stopLoading} = useBoolean(false)
    
    const router = useRouter()
    const { storeId } = useParams()

    const handleCopyProductId = async (id: string) => {
        try{
            await navigator.clipboard.writeText(id)
            toast.success("Product ID Copied to the clipboard")
        } catch (error) {
            toast.error("Failed to copy ID")
        }
    }

    const handleDeleteProduct = async () => {
        try {
            startLoading()
            await axios.delete(`/api/${storeId}/products/${productData.id}`)
            router.refresh()
            router.push(`/${storeId}/products`)
            toast.success("Product deleted successfully!")
        } catch (error) {
            toast.error("Something went wrong, please try again!")
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
                onConfirm={handleDeleteProduct}
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
                    <DropdownMenuItem onClick={() => handleCopyProductId(productData.id)}>
                        <div className="flex items-center hover:text-blue-500 cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" />
                                Copy ID
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${storeId}/products/${productData.id}`)}>
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