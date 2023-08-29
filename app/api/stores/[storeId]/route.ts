import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export const PATCH = async (req: Request, { params } : { params: { storeId: string } }) => {
    try{
        const { userId } = auth()
        const body = await req.json()
        const { name } = body
        const { storeId } = params

        if (!userId){
            return new NextResponse("Unauthenticated!", { status: 401 })
        }

        if (!name){
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!storeId){
            return new NextResponse("Store ID is required", { status: 400 })
        }

        const store = await prisma?.store.updateMany({
            where: {
                id: storeId,
                userId
            },
            data: {
                name
            }
        })

        return NextResponse.json(store)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const DELETE = async (req: Request, { params } : { params: { storeId: string } }) => {
    try{
        const { userId } = auth()
        const { storeId } = params

        if (!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!storeId){
            return new NextResponse("Store ID is required", { status: 400 })
        }

        const store = await prisma?.store.deleteMany({
            where: {
                id: storeId,
                userId
            },
        })

        return NextResponse.json(store)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}