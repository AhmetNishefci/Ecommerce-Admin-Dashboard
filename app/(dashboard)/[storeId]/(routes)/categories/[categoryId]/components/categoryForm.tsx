"use client"

import { Billboard, Category } from "@prisma/client"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


type CategoryFormProps = {
    categoryData: Category | null
    billboards: Billboard[]
}

const categoryFormSchema = z.object({
    name: z.string().nonempty("Category name is required"),
    billboardId: z.string().nonempty("Billboard is required"),
})

type categoryFormValues = z.infer<typeof categoryFormSchema>

export const CategoryForm = ({
    categoryData,
    billboards
}: CategoryFormProps) => {
    const { storeId, categoryId } = useParams()
    const router = useRouter()

    const {value: isAlertModalOpen, setFalse: closeAlertModal, setTrue: openAlertModal ,toggle: toggleAlertModal} = useBoolean(false)
    const {value: isLoading, setTrue: startLoading, setFalse: stopLoading} = useBoolean(false)

    const categoryTitle = categoryData ? "Edit Category" : "Create Category"
    const categoryDescription = categoryData ? "Edit your category" : "Add a new category"
    const toastSuccessMessage = categoryData ? "Category updated successfully!" : "Category created successfully!"
    const categoryActionButtonLabel = categoryData ? "Save Changes" : "Create Category"

    const categoryForm = useForm<categoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: categoryData || {
            name: "",
            billboardId: "",
        }
    })

    const handleCategorySubmit = async (values: categoryFormValues) => {
        try {
            startLoading()
            if (categoryData) {
                await axios.patch(`/api/${storeId}/categories/${categoryId}`, values)
            } else {
                await axios.post(`/api/${storeId}/categories`, values)
            }
            router.refresh()
            router.push(`/${storeId}/categories`)
            toast.success(toastSuccessMessage)
        } catch (error) {
            toast.error("Something went wrong, please try again!")
        } finally {
            stopLoading()
        }
    }

    const handleDeleteCategory = async () => {
        try {
            startLoading()
            await axios.delete(`/api/${storeId}/categories/${categoryId}`)
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
            <div className="flex items-center justify-between">
                <Heading 
                    title={categoryTitle}
                    description={categoryDescription}
                />
                {categoryData && (
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
            <Form {...categoryForm}>
                <form onSubmit={categoryForm.handleSubmit(handleCategorySubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={categoryForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Category Name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={categoryForm.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                     <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                     >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value}
                                                    placeholder="Select a billboard"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem
                                                    key={billboard.id}
                                                    value={billboard.id}
                                                >
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>  
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isLoading} className="ml-auto" type="submit">
                        {categoryActionButtonLabel}
                    </Button>
                </form> 
            </Form>
        </>
    )
}