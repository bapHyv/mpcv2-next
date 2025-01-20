'use client'
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { getTranslations } from "next-intl/server";
import { useAuth } from "../context/authContext";
import Dropdown from "@/app/components/Dropdown";


export default function ProfileHeader({ locale }: { locale: string }) {

    const { isSignedIn, logout } = useAuth()
    // const t = await getTranslations({ locale, namespace: "navbar" });


    // TODO add href and icons
    const itemsProfile = [
        {
            text: ("info"),
            href: `/mon_compte/profile`,
        },
        {
            text: ("adresses"),
            href: `/mon_compte/adresses`,
        },
        {
            text: ("orders"),
            href: `/mon_compte/commandes`,
        },
        {
            text: ("fidelity"),
            href: `/mon_compte/fidelite`,
        },
        {
            text: ("logout"),
            onClick: () => logout(), // Add the logout function directly
        }
    ];


    const itemsAuth = [
        {
            text: ("connection"),
            href: `/login`,
        },
        {
            text: ("register"),
            href: `/register`,
        },

    ];


    return (
        <Dropdown
            button={
                <>
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon className="h-8 w-8 text-white" role="button" />
                </>
            }
            items={isSignedIn ? itemsProfile : itemsAuth}
            locale={locale}
            menuButtonClassname="rounded-full p-1"
            menuItemsClassname="right-0 left-auto"
        />
    )
}