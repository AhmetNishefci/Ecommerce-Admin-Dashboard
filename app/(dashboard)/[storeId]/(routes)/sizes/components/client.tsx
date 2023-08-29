"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { SizesColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/dataTable"
import { ApiList } from "@/components/ui/apiList"


type SizesClientProps = {
    sizesData: SizesColumn[]
}

export const SizesClient = ({
    sizesData
}: SizesClientProps) => {
    const router = useRouter()
    const { storeId } = useParams()
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Sizes (${sizesData.length})`}
                    description="Manage your sizes"
                />
                <Button onClick={() => router.push(`/${storeId}/sizes/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Size
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={sizesData} searchKey="name"/>
            <Heading 
                title="API"
                description="API calls for sizes"
            />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId"/>
        </>
    )
}