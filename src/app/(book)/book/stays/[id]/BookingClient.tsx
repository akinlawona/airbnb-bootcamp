"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ListingWithRelations } from "@/lib/types";
import React, { useEffect, useReducer } from "react";
import { BiSolidLeftArrow, BiSolidLeftArrowCircle } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { meanBy } from "lodash";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  dateRangeText,
  numberOfNights,
  priceFormatter,
  timeAgo,
} from "@/lib/helpers";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import useAuthCardDialogStore from "@/hooks/use-auth-card-dialog";
import useReservationCalendarStore from "@/hooks/use-reservation-calendar-store";
import { createReservation } from "@/actions/listing/create-reservation";
import toast from "react-hot-toast";
import Link from "next/link";
import ReservationCalendarDialog from "@/components/listings/ReservationCalendarDialog";
import useReservationCalendarDialogStore from "@/hooks/use-reservation-calendar-dialog";
import GuestFilterDialog from "@/components/desktop/GuestFilterDialog";
import useGuestFilterDialogStore from "@/hooks/use-guest-filter-dialog";
import useGuestFilterStore from "@/hooks/use-guest-filter-store";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  listing: ListingWithRelations;
};

const StarRatings = dynamic(() => import("react-star-ratings"), {
  ssr: false,
});

type BookingStep =
  | "whenToPay"
  | "paymentMethod"
  | "messageToHost"
  | "requestToBook";

type BookingState = {
  currentStep: BookingStep;
  selectedPaymentOption: string | null;
};

type BookingAction =
  | { type: "NEXT_STEP" }
  | { type: "GO_TO_STEP"; step: BookingStep }
  | { type: "SET_PAYMENT_OPTION"; option: string };

const bookingReducer = (
  state: BookingState,
  action: BookingAction,
): BookingState => {
  switch (action.type) {
    case "NEXT_STEP":
      const steps: BookingStep[] = [
        "whenToPay",
        "paymentMethod",
        "messageToHost",
        "requestToBook",
      ];
      const currentIndex = steps.indexOf(state.currentStep);
      const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
      return { ...state, currentStep: steps[nextIndex] };
    case "GO_TO_STEP":
      return { ...state, currentStep: action.step };
    case "SET_PAYMENT_OPTION":
      return { ...state, selectedPaymentOption: action.option };
    default:
      return state;
  }
};

const BookingClient = ({ listing }: Props) => {
  const [state, dispatch] = useReducer(bookingReducer, {
    currentStep: "whenToPay",
    selectedPaymentOption: "payNow",
  });
  const { open: OpenAuthCard } = useAuthCardDialogStore();
  const user = useCurrentUser();
  const { date, setDate } = useReservationCalendarStore();
  const { open } = useReservationCalendarDialogStore();
  const { open: openGuestFilter } = useGuestFilterDialogStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync dates from URL on mount
  useEffect(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (checkIn && checkOut && !date?.from) {
      // Parse as local date to avoid timezone issues
      const [fromYear, fromMonth, fromDay] = checkIn.split("-").map(Number);
      const [toYear, toMonth, toDay] = checkOut.split("-").map(Number);

      const from = new Date(fromYear, fromMonth - 1, fromDay);
      const to = new Date(toYear, toMonth - 1, toDay);

      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        setDate({ from, to });
      }
    }
  }, [setDate, date?.from, searchParams]);

  // Sync guests from URL on mount

  const { adultsCount, childrenCount, infantsCount, petsCount } =
    useGuestFilterStore();

  // Update URL when dates or guests change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Helper function to format date in local timezone
    const formatDateLocal = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (date?.from) {
      params.set("checkIn", formatDateLocal(date.from));
    } else {
      params.delete("checkIn");
    }

    if (date?.to) {
      params.set("checkOut", formatDateLocal(date.to));
    } else {
      params.delete("checkOut");
    }

    if (adultsCount > 0) {
      params.set("adults", adultsCount.toString());
    } else {
      params.delete("adults");
    }

    if (childrenCount > 0) {
      params.set("children", childrenCount.toString());
    } else {
      params.delete("children");
    }

    if (infantsCount > 0) {
      params.set("infants", infantsCount.toString());
    } else {
      params.delete("infants");
    }

    if (petsCount > 0) {
      params.set("pets", petsCount.toString());
    } else {
      params.delete("pets");
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [
    date?.from,
    date?.to,
    adultsCount,
    childrenCount,
    infantsCount,
    petsCount,
    router,
    searchParams,
  ]);

  const getNightsText = (from?: Date, to?: Date) => {
    if (!from || !to) return "";
    const nights = Number(numberOfNights(to, from));
    return `${nights} ${nights === 1 ? "night" : "nights"}`;
  };

  const getTotalPrice = (from?: Date, to?: Date) => {
    if (!from || !to) return 0;
    const nights = Number(numberOfNights(to, from));
    return nights * listing.price!;
  };

  const getTotalPriceText = (from?: Date, to?: Date) => {
    if (!from || !to) return "";
    return `${priceFormatter.format(getTotalPrice(from, to))}kr NOK`;
  };

  const getPreviousDay = (date: Date | undefined) => {
    if (!date) return undefined;
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    return previousDay;
  };

  const getPreviousDayText = (date?: Date) => {
    const prevDay = getPreviousDay(date);
    if (!prevDay) return "";
    return prevDay.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleNextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const handleGoToStep = (step: BookingStep) => {
    dispatch({ type: "GO_TO_STEP", step });
  };

  const handlePaymentOptionChange = (option: string) => {
    dispatch({ type: "SET_PAYMENT_OPTION", option });
  };

  useEffect(() => {
    if (
      state.currentStep === "paymentMethod" &&
      state.selectedPaymentOption === "payOverTime"
    ) {
      dispatch({ type: "NEXT_STEP" });
    }
  }, [state.currentStep, state.selectedPaymentOption]);

  const steps: BookingStep[] = [
    "whenToPay",
    "paymentMethod",
    "messageToHost",
    "requestToBook",
  ];

  const isStepCompleted = (step: BookingStep) => {
    const currentIndex = steps.indexOf(state.currentStep);
    const stepIndex = steps.indexOf(step);
    return stepIndex < currentIndex;
  };

  const averageRating =
    listing.reviews.length > 0
      ? meanBy(listing.reviews, (review) => review.averageRating)
      : 0;

  const handleReservation = async () => {
    try {
      if (!user) {
        OpenAuthCard();
        return;
      }

      if (date?.to === undefined || date?.from === undefined) {
        return;
      }
      const nights = numberOfNights(date.to, date.from);

      const totalPrice = getTotalPrice(date.from, date.to);
      const guestId = user.id;

      const reservation = await createReservation({
        listingId: listing.id,
        guestId,
        checkInDate: date.from,
        checkOutDate: date.to,
        totalPrice,
        nights,
        pricePerNight: listing.price!,
      });

      if (reservation.success) {
        toast.success("Reservation created");
        // Navigate first, BEFORE clearing dates to avoid useEffect interference
        router.push("/trips/v1");
      } else {
        console.error("Reservation failed:", reservation.error);
        toast.error(reservation.error || "Failed to create reservation");
      }
    } catch (error) {
      console.error("Error in handleReservation:", error);
      toast.error("An error occurred");
    }
  };

  const isGuestEmpty =
    adultsCount === 0 &&
    childrenCount === 0 &&
    infantsCount === 0 &&
    petsCount === 0;

  return (
    <div className="max-w-4xl m-auto p-4">
      <div className="flex flex-col gap-6">
        <div className="flex gap-3  ">
          <Link href={`/listings/${listing.id}`}>
            <FaArrowLeft size={40} className="rounded-full bg-gray-100 p-3" />
          </Link>
          <div className="flex flex-col gap-3  w-full">
            <p className="text-3xl font-bold">Request to book</p>
            <div className="flex flex-col-reverse md:flex-row gap-12">
              <div className="w-full md:w-3/5 flex flex-col gap-3">
                <Card className="rounded-3xl">
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-lg font-semibold">
                        1. Choose when to pay{" "}
                      </p>
                      {isStepCompleted("whenToPay") && (
                        <Button
                          variant="outline"
                          className="bg-gray-100 hover:bg-gray-200"
                          onClick={() => handleGoToStep("whenToPay")}
                        >
                          Change
                        </Button>
                      )}
                    </div>
                    {state.currentStep === "whenToPay" && (
                      <>
                        <RadioGroup
                          value={state.selectedPaymentOption || "payNow"}
                          className="w-full"
                          onValueChange={handlePaymentOptionChange}
                        >
                          <div className="flex justify-between gap-3">
                            <Label htmlFor="r1">
                              Pay {getTotalPriceText(date?.from, date?.to)} now
                            </Label>
                            <RadioGroupItem value="payNow" id="r1" />
                          </div>
                          <hr className="my-3" />
                          <div className="flex justify-between gap-3">
                            <div className="flex flex-col gap-1">
                              <Label htmlFor="r2">Pay 0 kr NOK now</Label>
                              <p className="text-xs text-muted-foreground">
                                {getTotalPriceText(date?.from, date?.to)}{" "}
                                charged on {getPreviousDayText(date?.from)}. No
                                extra fees. More info
                              </p>
                            </div>
                            <RadioGroupItem value="payLater" id="r2" />
                          </div>
                          <hr className="my-3" />
                          <div className="flex justify-between gap-3">
                            <div className="flex flex-col gap-1">
                              <Label htmlFor="r3">
                                Pay over time with Klarna
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Choose a flexible payment option that works for
                                you. More info.
                              </p>
                            </div>
                            <RadioGroupItem value="payOverTime" id="r3" />
                          </div>
                          <hr className="my-3" />
                        </RadioGroup>
                        <div className="flex justify-end">
                          <Button
                            onClick={handleNextStep}
                            disabled={
                              date?.from === undefined || date.to === undefined
                            }
                          >
                            Next
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="rounded-3xl">
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-lg font-semibold">
                        2. Add a payment Method{" "}
                      </p>
                      {isStepCompleted("paymentMethod") &&
                        state.selectedPaymentOption !== "payOverTime" && (
                          <Button
                            variant="outline"
                            className="bg-gray-100 hover:bg-gray-200"
                            onClick={() => handleGoToStep("paymentMethod")}
                          >
                            Change
                          </Button>
                        )}
                    </div>
                    {state.selectedPaymentOption === "payOverTime" &&
                    (state.currentStep === "paymentMethod" ||
                      isStepCompleted("paymentMethod")) ? (
                      <p className="text-xs text-muted-foreground mb-3">
                        By continuing, you accept Klarna Shopping Service Terms
                        and confirm that you have read the Klarna Privacy Notice
                        and the Klarna Cookie Notice.
                      </p>
                    ) : (
                      state.currentStep === "paymentMethod" && (
                        <>
                          <p>Card Form</p>
                          <div className="flex justify-end">
                            <Button onClick={handleNextStep}>Next</Button>
                          </div>
                        </>
                      )
                    )}
                  </CardContent>
                </Card>
                <Card className="rounded-3xl">
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">
                        3. Write a message to the host{" "}
                      </p>
                      {isStepCompleted("messageToHost") && (
                        <Button
                          variant="outline"
                          className="bg-gray-100 hover:bg-gray-200"
                          onClick={() => handleGoToStep("messageToHost")}
                        >
                          Change
                        </Button>
                      )}
                    </div>
                    {state.currentStep === "messageToHost" && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Before you can continue, let Elise know a little about
                          your trip and why their place is a good fit.
                        </p>
                        <div className="flex gap-3">
                          <Avatar className="size-12">
                            <AvatarImage src={`${listing.user.image}`} />
                            <AvatarFallback>
                              {listing.user.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-sm">{listing.user.name}</p>

                            <p className="text-xs text-muted-foreground">
                              Hosting since {timeAgo(listing.user.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Textarea
                          maxLength={500}
                          className="w-full rounded-lg border border-gray-800 bg-white px-3 py-2 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-black min-h-32"
                          rows={5}
                        />

                        <div className="flex justify-end">
                          <Button onClick={handleNextStep}>Done</Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="rounded-3xl">
                  <CardContent className="flex flex-col gap-2">
                    <p className="text-lg font-semibold">
                      4. Review your request{" "}
                    </p>

                    {state.currentStep === "requestToBook" && (
                      <>
                        <p className="text-sm">
                          The host has 24 hours to confirm your booking.
                          You&apos;ll be charged after the request is accepted.
                        </p>
                        <hr className="my-2" />
                        <p className="text-xs text-muted-foreground">
                          By selecting the button, I agree to the booking terms.
                        </p>

                        <div className="flex w-full">
                          <Button
                            className="w-full bg-red-400 hover:bg-red-500"
                            onClick={handleReservation}
                            disabled={
                              date?.from === undefined || date?.to === undefined
                            }
                          >
                            Request to book
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              <Card className="rounded-3xl w-full md:w-1/2 sticky top-30 self-start">
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={listing.photos[0].url}
                        alt="coverPicture"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold line-clamp-">
                        {listing.title}
                      </p>
                      {listing.reviews.length > 0 && (
                        <div className="flex gap-2 items-baseline">
                          <StarRatings
                            rating={averageRating}
                            starRatedColor="black"
                            starDimension="12px"
                            starSpacing="1px"
                          />
                          <p className="text-xs">
                            {averageRating.toFixed(1)}({listing.reviews.length})
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold">Free cancellation</p>
                    <p className="text-xs">
                      Cancel before {getPreviousDayText(date?.from)} for a full
                      refund. Full policy
                    </p>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold">Dates</p>
                      <p className="text-sm">
                        {dateRangeText(date?.from, date?.to)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-gray-100 hover:bg-gray-200"
                      onClick={open}
                    >
                      Change
                    </Button>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold">Guests</p>
                      <p className="text-sm">
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
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-gray-100 hover:bg-gray-200"
                      onClick={openGuestFilter}
                    >
                      Change
                    </Button>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold">Price details</p>
                      <p className="text-sm">
                        {date &&
                          date.from &&
                          date.to &&
                          `${getNightsText(date?.from, date?.to)}
                        x ${listing.price}`}
                      </p>
                    </div>

                    <p className="text-sm">
                      {getTotalPriceText(date?.from, date?.to)}
                    </p>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold">Total NOK</p>
                      <p className="text-sm font-semibold">Price breakdown</p>
                    </div>

                    <p className="text-sm font-semibold">
                      {getTotalPriceText(date?.from, date?.to)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ReservationCalendarDialog
        reservations={listing.reservations}
        location={listing.location}
      />
      <GuestFilterDialog />
    </div>
  );
};

export default BookingClient;
