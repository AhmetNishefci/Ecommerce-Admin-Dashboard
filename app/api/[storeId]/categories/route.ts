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
 
        const { name, billboardId } = body

        if (!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name){
            return new NextResponse("Missing name", { status: 400 })
        }

        if (!billboardId){
            return new NextResponse("Missing billboardId", { status: 400 })
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

        const category = await prisma.category.create({
            data: {
                name,
                billboardId,
                storeId
            }
        })

        return NextResponse.json(category)
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

        const categories = await prisma.category.findMany({
            where: {
                storeId
            }
        })

        return NextResponse.json(categories)
    } catch (error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

