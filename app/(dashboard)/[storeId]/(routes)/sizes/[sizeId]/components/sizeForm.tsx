"use client"

import {  Size } from "@prisma/client"
import { Trash } from "lucide-react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useBoolean } from "usehooks-ts"
import axios from "axios"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alertModal"
import { ImageUpload } from "@/components/ui/imageUpload"


type SizesProps = {
    sizesData: Size | null
}

const sizesFormSchema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    value: z.string().nonempty({ message: "Value is required" }),
})

type sizeFormValues = z.infer<typeof sizesFormSchema>

export const SizeForm = ({
    sizesData
}: SizesProps) => {
    const { storeId, sizeId } = useParams()
    const router = useRouter()

    const {value: isAlertModalOpen, setFalse: closeAlertModal, setTrue: openAlertModal ,toggle: toggleAlertModal} = useBoolean(false)
    const {value: isLoading, setTrue: startLoading, setFalse: stopLoading} = useBoolean(false)

    const sizeTitle = sizesData ? "Edit Size" : "Create Size"
    const sizeDescription = sizesData ? "Edit your size" : "Add a new size"
    const toastSuccessMessage = sizesData ? "Size updated successfully!" : "Size created successfully!"
    const sizeActionButtonLabel = sizesData ? "Save Changes" : "Create Size"

    const sizeForm = useForm<sizeFormValues>({
        resolver: zodResolver(sizesFormSchema),
        defaultValues: sizesData || {
            name: "",
            value: "",
        }
    })

    const handleSizesSubmit = async (values: sizeFormValues) => {
        try {
            startLoading()
            if (sizesData) {
                await axios.patch(`/api/${storeId}/sizes/${sizeId}`, values)
            } else {
                await axios.post(`/api/${storeId}/sizes`, values)
            }
            router.refresh()
            router.push(`/${storeId}/sizes`)
            toast.success(toastSuccessMessage)
        } catch (error) {
            toast.error("Something went wrong, please try again!")
        } finally {
            stopLoading()
        }
    }

    const handleDeleteSize = async () => {
        try {
            startLoading()
            await axios.delete(`/api/${storeId}/sizes/${sizeId}`)
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
            <div className="flex items-center justify-between">
                <Heading 
                    title={sizeTitle}
                    description={sizeDescription}
                />
                {sizesData && (
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        size="icon"
                        onClick={() => openAlertModal()}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                 )}
            </div>
            <Separator />
            <Form {...sizeForm}>
                <form onSubmit={sizeForm.handleSubmit(handleSizesSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={sizeForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Size Name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={sizeForm.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Size Value" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isLoading} className="ml-auto" type="submit">
                        {sizeActionButtonLabel}
                    </Button>
                </form> 
            </Form>
        </>
    )
}