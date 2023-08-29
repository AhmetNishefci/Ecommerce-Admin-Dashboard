"use client"

import { Color } from "@prisma/client"
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


type ColorProps = {
    colorData: Color | null
}

const colorFormSchema = z.object({
   name: z.string().nonempty({ message: "Name is required" }),
   value: z.string().min(4).regex(/^#/, {
         message: "Value must be a valid hex color"
   })
})

type colorFormValues = z.infer<typeof colorFormSchema>

export const ColorForm = ({
    colorData
}: ColorProps) => {
    const { storeId, colorId } = useParams()
    const router = useRouter()

    const {value: isAlertModalOpen, setFalse: closeAlertModal, setTrue: openAlertModal ,toggle: toggleAlertModal} = useBoolean(false)
    const {value: isLoading, setTrue: startLoading, setFalse: stopLoading} = useBoolean(false)

    const colorTitle = colorData ? "Edit Color" : "Create Color"
    const colorDescription = colorData ? "Edit your color" : "Add a new color"
    const toastSuccessMessage = colorData ? "Color updated successfully!" : "Color created successfully!"
    const colorActionButtonLabel = colorData ? "Save Changes" : "Create Color"

    const colorsForm = useForm<colorFormValues>({
        resolver: zodResolver(colorFormSchema),
        defaultValues: colorData || {
            name: "",
            value: "",
        }
    })

    const handleColorsSubmit = async (values: colorFormValues) => {
        try {
            startLoading()
            if (colorData) {
                await axios.patch(`/api/${storeId}/colors/${colorId}`, values)
            } else {
                await axios.post(`/api/${storeId}/colors`, values)
            }
            router.refresh()
            router.push(`/${storeId}/colors`)
            toast.success(toastSuccessMessage)
        } catch (error) {
            toast.error("Something went wrong, please try again!")
        } finally {
            stopLoading()
        }
    }

    const handleDeleteColor = async () => {
        try {
            startLoading()
            await axios.delete(`/api/${storeId}/colors/${colorId}`)
            router.refresh()
            router.push(`/${storeId}/colors`)
            toast.success("Color deleted successfully!")
        } catch (error) {
            toast.error("This color is being used, please delete the products using it first!")
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
                onConfirm={handleDeleteColor}
                loading={isLoading}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title={colorTitle}
                    description={colorDescription}
                />
                {colorData && (
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
            <Form {...colorsForm}>
                <form onSubmit={colorsForm.handleSubmit(handleColorsSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={colorsForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Color Name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={colorsForm.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-x-4">
                                            <Input disabled={isLoading} placeholder="Color Value" {...field}/>
                                            <div 
                        className="border p-4 rounded-full" 
                        style={{ backgroundColor: field.value }}
                      />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isLoading} className="ml-auto" type="submit">
                        {colorActionButtonLabel}
                    </Button>
                </form> 
            </Form>
        </>
    )
}