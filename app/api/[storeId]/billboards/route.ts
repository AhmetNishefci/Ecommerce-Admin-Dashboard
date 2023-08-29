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
 
        const { label, imageUrl } = body

        if (!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!label){
            return new NextResponse("Missing name", { status: 400 })
        }

        if (!imageUrl){
            return new NextResponse("Missing imageUrl", { status: 400 })
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

        const billboard = await prisma.billboard.create({
            data: {
                label,
                imageUrl,
                storeId
            }
        })

        return NextResponse.json(billboard)
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

        const billboards = await prisma.billboard.findMany({
            where: {
                storeId
            }
        })

        return NextResponse.json(billboards)
    } catch (error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

