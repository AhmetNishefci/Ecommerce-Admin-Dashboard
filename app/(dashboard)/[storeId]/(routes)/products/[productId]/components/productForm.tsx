"use client"

import { Product, Image, Category, Size, Color } from "@prisma/client"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alertModal"
import { ImageUpload } from "@/components/ui/imageUpload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"


type ProductFormProps = {
    productsData: Product & {
        images: Image[]
    } | null
    categories: Category[]
    sizes: Size[]
    colors: Color[]
}

const productFormSchema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    images: z.object({url: z.string()}).array(),
    price: z.coerce.number().nonnegative({ message: "Price must be a positive number" }),
    categoryId: z.string().nonempty({ message: "Category is required" }),
    colorId: z.string().nonempty({ message: "Color is required" }),
    sizeId: z.string().nonempty({ message: "Size is required" }),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

type productFormValues = z.infer<typeof productFormSchema>

export const ProductForm = ({
    productsData,
    categories,
    sizes,
    colors
}: ProductFormProps) => {
    const { storeId, productId } = useParams()
    const router = useRouter()

    const {value: isAlertModalOpen, setFalse: closeAlertModal, setTrue: openAlertModal ,toggle: toggleAlertModal} = useBoolean(false)
    const {value: isLoading, setTrue: startLoading, setFalse: stopLoading} = useBoolean(false)

    const productTitle = productsData ? "Edit Product" : "Create Product"
    const productDescription = productsData ? "Edit your product" : "Add a new product"
    const toastSuccessMessage = productsData ? "Product updated successfully!" : "Product created successfully!"
    const productActionButtonLabel = productsData ? "Save Changes" : "Create Product"

    const productsForm = useForm<productFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: productsData ? {
            ...productsData,
            price: parseFloat(productsData.price.toString())
        } : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            colorId: "",
            sizeId: "",
            isFeatured: false,
            isArchived: false,
        }
    })

    const handleProductSubmit = async (values: productFormValues) => {
        try {
            startLoading()
            if (productsData) {
                await axios.patch(`/api/${storeId}/products/${productId}`, values)
            } else {
                await axios.post(`/api/${storeId}/products`, values)
            }
            router.refresh()
            router.push(`/${storeId}/products`)
            toast.success(toastSuccessMessage)
        } catch (error) {
            toast.error("Something went wrong, please try again!")
        } finally {
            stopLoading()
        }
    }

    const handleDeleteProduct = async () => {
        try {
            startLoading()
            await axios.delete(`/api/${storeId}/products/${productId}`)
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
            <div className="flex items-center justify-between">
                <Heading 
                    title={productTitle}
                    description={productDescription}
                />
                {productsData && (
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
            <Form {...productsForm}>
                <form onSubmit={productsForm.handleSubmit(handleProductSubmit)} className="space-y-8 w-full">
                        <FormField 
                            control={productsForm.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <FormControl>
                                        <ImageUpload 
                                            disabled={isLoading}
                                            value={field.value.map((image) => image.url)}
                                            onChange={(url) => field.onChange([...field.value, {url}])}
                                            onRemove={(url) => field.onChange([...field.value.filter((image) => image.url !== url)])}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={productsForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Product Name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={productsForm.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={isLoading} placeholder="9.99" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={productsForm.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
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
                                                    placeholder="Select a category"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>  
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={productsForm.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
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
                                                    placeholder="Select a size"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem
                                                    key={size.id}
                                                    value={size.id}
                                                >
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>  
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={productsForm.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
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
                                                    placeholder="Select a color"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem
                                                    key={color.id}
                                                    value={color.id}
                                                >
                                                    {color.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>  
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={productsForm.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Featured</FormLabel>
                                        <FormDescription>
                                            Featured products will be displayed on the home page
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={productsForm.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Archived</FormLabel>
                                        <FormDescription>
                                            Archived products will be hidden from the store
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isLoading} className="ml-auto" type="submit">
                        {productActionButtonLabel}
                    </Button>
                </form> 
            </Form>
        </>
    )
}