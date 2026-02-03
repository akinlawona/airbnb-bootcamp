import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isWithinInterval,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { numberOfNights, priceFormatter } from "@/lib/helpers";
import { useSession } from "next-auth/react";
import { createReservation } from "@/actions/listing/create-reservation";
import toast from "react-hot-toast";
import { Reservation } from "../../../generated/prisma";
import useReservationCalendarStore from "@/hooks/use-reservation-calendar-store";
import useGuestFilterPopoverReservationStore from "@/hooks/use-guest-filter-popover-reservation";
import GuestFilterReservation from "../desktop/GuestFilterReservation";
import useGuestFilterStore from "@/hooks/use-guest-filter-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import useAuthCardDialogStore from "@/hooks/use-auth-card-dialog";
import { useRouter } from "next/navigation";

type Props = {
  listingId: string;
  price: number;
  weekendPrice: number;
  reservations: Reservation[];
};

const CreateReservation = ({
  price,
  weekendPrice,
  listingId,
  reservations,
}: Props) => {
  const { date, setDate } = useReservationCalendarStore();
  const [isOpen, setIsOpen] = useState(false);
  const { open: OpenAuthCard } = useAuthCardDialogStore();
  const router = useRouter();

  const user = useCurrentUser();

  const handleReset = () => {
    setDate({
      from: undefined,
      to: undefined,
    });
    setIsOpen(false);
  };
  const handleSelect = (selected: DateRange | undefined) => {
    setDate({
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    });
  };
  const handleApply = () => {
    if (date) {
      setDate(date);
    }
    setIsOpen(false);
  };

  const handleReservation = async () => {
    if (!user) {
      OpenAuthCard();
      return;
    }
    router.push(`/book/stays/${listingId}`);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) return true;

    // Disable dates within existing reservations
    return reservations.some((reservation) => {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      return isWithinInterval(date, {
        start: checkIn,
        end: checkOut,
      });
    });
  };

  const { adultsCount, childrenCount, infantsCount, petsCount } =
    useGuestFilterStore();

  const {
    isOpen: isGuestFilterOpen,
    toggle,
    close,
  } = useGuestFilterPopoverReservationStore();

  const isGuestEmpty =
    adultsCount === 0 &&
    childrenCount === 0 &&
    infantsCount === 0 &&
    petsCount === 0;

  return (
    <Card className="shadow-lg rounded-lg">
      <CardContent className="flex flex-col gap-6">
        <p className="text-xl font-bold">
          {date?.to &&
            date?.from &&
            `${priceFormatter.format(Number(numberOfNights(date.to, date.from) * price))}kr NOK total`}{" "}
        </p>
        <div className="flex flex-col">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverAnchor asChild>
              <div
                className="grid grid-cols-2 border rounded-t-md border-gray-400 hover:cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <div className="flex flex-col border-r border-gray-400 p-2 gap-1">
                  <p className="text-xs font-bold">CHECK-IN</p>
                  <p className="text-xs">
                    {date?.from ? (
                      <>{format(date.from, "LLL dd, y")}</>
                    ) : (
                      <span>Add dates</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col p-2 gap-1">
                  <p className="text-xs font-bold">CHECKOUT</p>
                  <p className="text-xs">
                    {date?.to ? (
                      <>{format(date.to, "LLL dd, y")}</>
                    ) : (
                      <span>Add dates</span>
                    )}
                  </p>
                </div>
              </div>
            </PopoverAnchor>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleSelect}
                numberOfMonths={2}
                min={1}
                disabled={isDateDisabled}
                excludeDisabled
              />
              <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={handleApply}>Apply</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover open={isGuestFilterOpen}>
            <PopoverAnchor asChild>
              <div
                onClick={toggle}
                className="border-t-0 border rounded-b-md border-gray-400 p-2"
              >
                <div className="flex flex-col">
                  <p className="text-xs font-bold">Guests</p>
                  <p className="text-xs">
                    <Button
                      variant="outline"
                      className="text-xs border-none shadow-none p-0 h-7 text-gray-500  hover:bg-transparent bg-transparent hover:cursor-pointer hover:text-gray-500  w-[120px] justify-start"
                    >
                      {isGuestEmpty
                        ? "Add guests"
                        : [
                            adultsCount > 0
                              ? `${adultsCount + childrenCount} ${
                                  adultsCount + childrenCount === 1
                                    ? "guest"
                                    : "guests"
                                }`
                              : "",
                            infantsCount > 0
                              ? `${infantsCount} ${
                                  infantsCount === 1 ? "infant" : "infants"
                                }`
                              : "",
                            petsCount > 0
                              ? `${petsCount} ${petsCount === 1 ? "pet" : "pets"}`
                              : "",
                          ]
                            .filter(Boolean)
                            .join(", ")}
                    </Button>
                  </p>
                </div>
              </div>
            </PopoverAnchor>
            <GuestFilterReservation />
          </Popover>
        </div>
        <Button
          disabled={date?.from === undefined || date?.to === undefined}
          className="bg-[#FF385C] rounded-2xl hover:bg-[#FF385C] "
          onClick={handleReservation}
        >
          Reserve
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          You won&apos;t be charged yet
        </p>
      </CardContent>
    </Card>
  );
};

export default CreateReservation;
