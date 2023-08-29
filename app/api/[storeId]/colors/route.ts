import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export const POST = async (req: Request, {
    params
} : {
    params: {
        storeId: string
    }
}) => {
    try{
        const { userId } = auth()
        const body = await req.json()
        const { storeId } = params
 
        const { name, value } = body

        if (!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name){
            return new NextResponse("Missing name", { status: 400 })
        }

        if (!value){
            return new NextResponse("Missing value", { status: 400 })
        }

        if (!storeId){
            return new NextResponse("Missing storeId", { status: 400 })
        }

        const storeByUserId = await prisma?.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if (!storeByUserId){
            return new NextResponse("Unauthorized!", { status: 403 })
        }

        const color = await prisma.color.create({
            data: {
                name,
                value,
                storeId
            }
        })

        return NextResponse.json(color)
    }catch (error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const GET = async (req: Request, {
    params
}: {
    params: {
        storeId: string
    }
}) => {
    try{
        const { storeId } = params

        if (!storeId){
            return new NextResponse("Missing storeId", { status: 400 })
        }

        const colors = await prisma.color.findMany({
            where: {
                storeId
            }
        })

        return NextResponse.json(colors)
    } catch (error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

