"use client"
import {type SessionProps} from "@/utils/sessionProps";
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from "@nextui-org/react";
import Link from "next/link";
import {Logo, ThemeSwitcher} from "./ui/ThemeSwitcher";
import {UserDropdown} from "./ui/user-dropdown";

export function Header({session, allow_login = true}: SessionProps) {
    return (
        <Navbar isBordered>
            <NavbarContent>
                <NavbarMenuToggle
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link href="/" color="secondary">
                        <div className="flex flex-row gap-3 align-center items-center">
                            <Logo/>

                            <div className={"flex flex-col align-center items-center"} style={{
                                height: "26px",
                                fontWeight: "bolder"
                            }}>
                                pSearch
                            </div>
                        </div>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Button as={Link} color="secondary" href="/search" variant="flat">
                        Search
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="secondary" href="/history" variant="flat">
                        History
                    </Button>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitcher/>
                </NavbarItem>
                <NavbarItem>
                    {allow_login && (session ? <UserDropdown session={session} allow_login={allow_login}/> :
                        <Button as={Link} color="secondary" href="/api/auth/signin?callbackUrl=/search">Sign
                            In</Button>)}
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                <NavbarMenuItem key="search">
                    <Link
                        color="foreground"
                        className="w-full"
                        href="/search"
                    >
                        Search
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem key="history">
                    <Link
                        color="foreground"
                        className="w-full"
                        href="/history"
                    >
                        History
                    </Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
}