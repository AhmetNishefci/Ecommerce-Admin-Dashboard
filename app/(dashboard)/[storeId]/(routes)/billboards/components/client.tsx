"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { BillboardColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/dataTable"
import { ApiList } from "@/components/ui/apiList"


type BillboardClientProps = {
    billboardsData: BillboardColumn[]
}

export const BillboardClient = ({
    billboardsData
}: BillboardClientProps) => {
    const router = useRouter()
    const { storeId } = useParams()
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Billboards (${billboardsData.length})`}
                    description="Manage your billboards"
                />
                <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Billboard
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={billboardsData} searchKey="label"/>
            <Heading 
                title="API"
                description="API calls for billboards"
            />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    )
}