import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prismadb";

import { MainNav } from "@/components/mainNav";
import { StoreSwitcher } from "@/components/storeSwitcher";
import { ThemeToggle } from "@/components/themeToggle";


export const Navbar = async () => {
    const { userId } = auth()

    if (!userId) {
        redirect('/sign-in')
    }

    const stores = await prisma?.store.findMany({
        where: {
            userId
        }
    })
    return ( 
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
               <StoreSwitcher items={stores}/>
                <MainNav className="mx-6"/>
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
     );
}

