import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prisma from "@/lib/prismadb"

export const POST = async (req: Request, res: Response) => {
    try{
        const { userId } = auth()
        const body = await req.json()
 
        const { name } = body

        if (!userId){
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!name){
            return new NextResponse("Missing name", { status: 400 })
        }

        const store = await prisma.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store)
    }catch (error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}