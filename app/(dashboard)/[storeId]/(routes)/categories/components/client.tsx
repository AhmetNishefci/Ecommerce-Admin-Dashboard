"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { CategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/dataTable"
import { ApiList } from "@/components/ui/apiList"


type CategoryClientProps = {
    categoriesData: CategoryColumn[]
}

export const CategoryClient = ({
    categoriesData
}: CategoryClientProps) => {
    const router = useRouter()
    const { storeId } = useParams()
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Categories (${categoriesData.length})`}
                    description="Manage your categories"
                />
                <Button onClick={() => router.push(`/${storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={categoriesData} searchKey="name"/>
            <Heading 
                title="API"
                description="API calls for categories"
            />
            <Separator />
            <ApiList entityName="categories" entityIdName="categoryId"/>
        </>
    )
}