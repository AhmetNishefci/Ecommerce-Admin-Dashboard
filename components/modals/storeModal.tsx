"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoolean } from "usehooks-ts";
import axios from "axios";
import toast from "react-hot-toast";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/useStoreModal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const formSchema = z.object({
    name: z.string().nonempty({ message: "Store name is required" }),
})

export const StoreModal = () => {
    const {isStoreModalOpen,closeStoreModal} = useStoreModal()

    const {value: isLoading, setTrue: startLoading, setFalse: stopLoading} = useBoolean(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try{
            startLoading()
            const response = await axios.post("/api/stores", data)
         
            toast.success('Store created successfully!')
            window.location.assign(`/${response.data.id}`)
        }catch(error){
            toast.error('Something went wrong!')
        }finally{
            stopLoading()
        }
    }

    return (
        <Modal 
            title="Create Store" 
            description="Add a new store to manage products and categories" 
            isOpen ={isStoreModalOpen}
            onClose={closeStoreModal}>
           <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} >
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading} 
                                                placeholder="E-Commerce" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button
                                    disabled={isLoading} 
                                    variant="outline"
                                    onClick={closeStoreModal}>Cancel</Button>
                                <Button 
                                    disabled={isLoading} type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
           </div>
        </Modal>
    )
}