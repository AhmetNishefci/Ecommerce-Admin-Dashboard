"use client"

import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { OrderColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/dataTable"

type OrderClientProps = {
    orderData: OrderColumn[]
}

export const OrderClient = ({
    orderData
}: OrderClientProps) => {
    return (
        <>
            <Heading 
                title={`Orders (${orderData.length})`}
                description="Manage your orders"
            />
            <Separator />
            <DataTable 
                columns={columns} 
                data={orderData} 
                searchKey="products"
            />
        </>
    )
}