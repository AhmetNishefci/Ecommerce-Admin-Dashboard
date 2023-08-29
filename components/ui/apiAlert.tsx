"use client"

import { Copy, Server } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

type ApiAlertProps = {
    title: string
    description: string
    variant: "public" | "admin"
}

const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin"
}

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive"
}

export const ApiAlert = ({
    title,
    description,
    variant
}: ApiAlertProps) => {
    const handleCopy = async () => {
       try{
            await navigator.clipboard.writeText(description)
            toast.success("API Route copied to clipboard!")
       } catch(error){
            toast.error("Something went wrong, please try again!")
       }
    }
    return (
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>
                    {textMap[variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4"/>
                </Button>
            </AlertDescription>
        </Alert>
    )
}