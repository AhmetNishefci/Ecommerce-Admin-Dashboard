"use client"

import { useParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const MainNav = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) => {
    const { storeId } = useParams()
    const pathname = usePathname()

    const routes = [
        {
            href: `/${storeId}`,
            label: "Overview",
            isActive: pathname === `/${storeId}`
        },
        {
            href: `/${storeId}/billboards`,
            label: "Billboards",
            isActive: pathname === `/${storeId}/billboards`
        },
        {
            href: `/${storeId}/categories`,
            label: "Categories",
            isActive: pathname === `/${storeId}/categories`
        },
        {
            href: `/${storeId}/sizes`,
            label: "Sizes",
            isActive: pathname === `/${storeId}/sizes`
        },
        {
            href: `/${storeId}/colors`,
            label: "Colors",
            isActive: pathname === `/${storeId}/colors`
        },
        {
            href: `/${storeId}/products`,
            label: "Products",
            isActive: pathname === `/${storeId}/products`
        },
        {
            href: `/${storeId}/orders`,
            label: "Orders",
            isActive: pathname === `/${storeId}/orders`
        },
        {
            href: `/${storeId}/settings`,
            label: "Settings",
            isActive: pathname === `/${storeId}/settings`
        }
    ]
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
            >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary", 
                        route.isActive ? "text-black dark:text-white font-bold" :
                        "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}