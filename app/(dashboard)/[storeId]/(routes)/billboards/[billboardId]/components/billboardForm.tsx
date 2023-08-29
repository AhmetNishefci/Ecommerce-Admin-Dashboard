"use client"

import { Billboard } from "@prisma/client"
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


type BillboardProps = {
    billboardData: Billboard | null
}

const billboardFormSchema = z.object({
    label: z.string().nonempty("Billboard name is required"),
    imageUrl: z.string().nonempty("Billboard image is required"),
})

type billboardFormValues = z.infer<typeof billboardFormSchema>

export const BillboardForm = ({
    billboardData
}: BillboardProps) => {
    const { storeId, billboardId } = useParams()
    const router = useRouter()

    const {value: isAlertModalOpen, setFalse: closeAlertModal, setTrue: openAlertModal ,toggle: toggleAlertModal} = useBoolean(false)
    const {value: isLoading, setTrue: startLoading, setFalse: stopLoading} = useBoolean(false)

    const billboardTitle = billboardData ? "Edit Billboard" : "Create Billboard"
    const billboardDescription = billboardData ? "Edit your billboard" : "Add a new billboard to manage products and categories"
    const toastSuccessMessage = billboardData ? "Billboard updated successfully!" : "Billboard created successfully!"
    const billboardActionButtonLabel = billboardData ? "Save Changes" : "Create Billboard"

    const billboardsForm = useForm<billboardFormValues>({
        resolver: zodResolver(billboardFormSchema),
        defaultValues: billboardData || {
            label: "",
            imageUrl: "",
        }
    })

    const handleBillboardsSubmit = async (values: billboardFormValues) => {
        try {
            startLoading()
            if (billboardData) {
                await axios.patch(`/api/${storeId}/billboards/${billboardId}`, values)
            } else {
                await axios.post(`/api/${storeId}/billboards`, values)
            }
            router.refresh()
            router.push(`/${storeId}/billboards`)
            toast.success(toastSuccessMessage)
        } catch (error) {
            toast.error("Something went wrong, please try again!")
        } finally {
            stopLoading()
        }
    }

    const handleDeleteBillboard = async () => {
        try {
            startLoading()
            await axios.delete(`/api/${storeId}/billboards/${billboardId}`)
            router.refresh()
            router.push(`/${storeId}/billboards`)
            toast.success("Billboard deleted successfully!")
        } catch (error) {
            toast.error("This billboard has categories, please delete them first!")
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
                onConfirm={handleDeleteBillboard}
                loading={isLoading}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title={billboardTitle}
                    description={billboardDescription}
                />
                {billboardData && (
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
            <Form {...billboardsForm}>
                <form onSubmit={billboardsForm.handleSubmit(handleBillboardsSubmit)} className="space-y-8 w-full">
                        <FormField 
                            control={billboardsForm.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload 
                                            disabled={isLoading}
                                            value={field.value ? [field.value] : []}
                                            onChange={(value) => field.onChange(value)}
                                            onRemove={() => field.onChange("")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={billboardsForm.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Billboard Name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isLoading} className="ml-auto" type="submit">
                        {billboardActionButtonLabel}
                    </Button>
                </form> 
            </Form>
        </>
    )
}