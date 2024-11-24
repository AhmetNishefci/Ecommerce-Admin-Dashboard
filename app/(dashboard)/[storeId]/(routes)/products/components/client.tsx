"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { ProductColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/dataTable"
import { ApiList } from "@/components/ui/apiList"


type ProductClientProps = {
    productsData: ProductColumn[]
}

export const ProductClient = ({
    productsData
}: ProductClientProps) => {
    const router = useRouter()
    const { storeId } = useParams()
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Products (${productsData.length})`}
                    description="Manage your products"
                />
                <Button onClick={() => router.push(`/${storeId}/products/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Product
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={productsData} searchKey="name"/>
            <Heading 
                title="API"
                description="API calls for products"
            />
            <Separator />
            <ApiList entityName="products" entityIdName="productId"/>
        </>
    )
}