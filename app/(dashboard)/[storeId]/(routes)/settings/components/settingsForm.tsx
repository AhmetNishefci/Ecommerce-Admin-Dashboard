"use client"

import { Store } from "@prisma/client"
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
import { ApiAlert } from "@/components/ui/apiAlert"
import { useOrigin } from "@/hooks/useOrigin"


type SettingsFormProps = {
    initialData: Store
}

const settingsFormSchema = z.object({
    name: z.string().nonempty("Store name is required"),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export const SettingsForm = ({
    initialData
}: SettingsFormProps) => {
    const { storeId } = useParams()
    const router = useRouter()
    const origin = useOrigin()

    const {value: isAlertModalOpen, setFalse: closeAlertModal, setTrue: openAlertModal ,toggle: toggleAlertModal} = useBoolean(false)
    const {value: isLoading, setTrue: startLoading, setFalse: stopLoading} = useBoolean(false)

    const settingsForm = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: initialData
    })

    const handleSettingsSubmit = async (values: SettingsFormValues) => {
        try {
            startLoading()
            await axios.patch(`/api/stores/${storeId}`, values)
            router.refresh()
            toast.success("Store updated successfully!")
        } catch (error) {
            toast.error("Something went wrong, please try again!")
        } finally {
            stopLoading()
        }
    }

    const handleDeleteStore = async () => {
        try {
            startLoading()
            await axios.delete(`/api/stores/${storeId}`)
            router.refresh()
            router.push("/")
            toast.success("Store deleted successfully!")
        } catch (error) {
            toast.error("Make sure you remeved all the products and categories before deleting the store!")
        } finally {
            stopLoading()
        }
    }
    return (
        <>
            <AlertModal 
                isOpen={isAlertModalOpen}
                onClose={closeAlertModal}
                onConfirm={handleDeleteStore}
                loading={isLoading}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title="Settings"
                    description="Manage your store settings"
                />
                <Button
                    disabled={isLoading}
                    variant="destructive"
                    size="icon"
                    onClick={() => openAlertModal()}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(handleSettingsSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={settingsForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Store Name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isLoading} className="ml-auto" type="submit">
                        Save Changes
                    </Button>
                </form> 
            </Form>
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${storeId}`} variant="public"/>
        </>
    )
}