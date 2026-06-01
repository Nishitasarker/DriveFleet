import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
export async function proxy(request){

     const session = await auth.api.getSession({
            headers: await headers()
        });

        if(!session){
             return NextResponse.redirect(new URL('/LogIn', request.url))
        }
    
    // return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
    matcher:['/MyBookings', '/AddCarForm',
        '/MyAddedCars', '/ExploreCar/:path','/src/app/AvailableCars/page.jsx'
    ]
}