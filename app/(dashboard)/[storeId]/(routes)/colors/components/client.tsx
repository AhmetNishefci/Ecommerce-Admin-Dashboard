"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { ColorColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/dataTable"
import { ApiList } from "@/components/ui/apiList"


type ColorClientProps = {
    colorsData: ColorColumn[]
}

export const ColorClient = ({
    colorsData
}: ColorClientProps) => {
    const router = useRouter()
    const { storeId } = useParams()
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Colors (${colorsData.length})`}
                    description="Manage your colors"
                />
                <Button onClick={() => router.push(`/${storeId}/colors/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Color
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={colorsData} searchKey="name"/>
            <Heading 
                title="API"
                description="API calls for colors"
            />
            <Separator />
            <ApiList entityName="colors" entityIdName="colorId"/>
        </>
    )
}