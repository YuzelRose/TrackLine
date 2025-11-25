"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BreadcrumbNav() {
    const pathname = usePathname();      
    const router = useRouter();

    const segments = pathname.split("/").filter(Boolean);

    const paths = segments.map((seg, index) => {
        return "/" + segments.slice(0, index + 1).join("/");
    });

    return (
        <nav>
            <span 
                onClick={() => router.push("/")}
                style={{ cursor: "pointer" }}
            >
                Home
            </span>

            {segments.map((segment, index) => (
                <span key={index}>
                    {" / "}
                    <span 
                        onClick={() => router.push(paths[index])}
                        style={{
                            cursor: "pointer"
                        }}
                    >
                        {segment}
                    </span>
                </span>
            ))}
        </nav>
    );
}
