"use client"

import { useOrigin } from "@/hooks/useOrigin"
import { useParams } from "next/navigation"
import { ApiAlert } from "./apiAlert"

type ApiListProps = {
    entityName: string
    entityIdName: string
}

export const ApiList = ({
    entityName,
    entityIdName
}: ApiListProps) => {
    const params = useParams()
    const origin = useOrigin()

    const baseUrl = `${origin}/api/${params.storeId}/${entityName}`

    return (
        <>
            <ApiAlert 
                title="GET"
                variant="public"
                description={baseUrl}
            />
              <ApiAlert 
                title="GET"
                variant="public"
                description={`${baseUrl}/{${entityIdName}}`}
            />
                <ApiAlert 
                title="POST"
                variant="admin"
                description={`${baseUrl}`}
            />
              <ApiAlert 
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/{${entityIdName}}`}
            />
        </>    
    )
}