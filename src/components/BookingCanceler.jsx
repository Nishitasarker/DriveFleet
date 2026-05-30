"use client";

import { AlertDialog, Button } from "@heroui/react";
import { Trash } from "lucide-react";

export function BookingCanceler({bookingId}) {

    const handleCancelBooking =async()=>{
        const res = await fetch(`http://localhost:5000/booking/${bookingId}` ,{
            method:"DELETE",
            headers:{
                "content-type": "application/json"
            }
        })
        const data = await res.json();
        console.log(data)
    }
  return (
    <AlertDialog>
      {/* Trigger Button */}
      <Button 
        className="rounded-lg px-3 py-2 bg-red-400 border-red-500 text-white font-medium items-center text-red-500 hover:bg-red-600 flex gap-1" 
        variant="bordered"
      >
        <Trash size={16} /> Cancel
      </Button>

      {/* Modal Dialog */}
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Heading>Are you sure?</AlertDialog.Heading>
            </AlertDialog.Header>
            
            <AlertDialog.Body>
              <p>This action will permanently cancel your booking. This cannot be undone.</p>
            </AlertDialog.Body>
            
            <AlertDialog.Footer>
              <Button variant="flat" slot="close">
                Cancel
              </Button>
              <Button color="danger" slot="close" onClick={handleCancelBooking}>
                Confirm Delete
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}