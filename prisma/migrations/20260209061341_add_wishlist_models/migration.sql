/*
  Warnings:

  - You are about to drop the column `guestFavorite` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `photos` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryToListing` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Made the column `icon` on table `Amenity` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Made the column `icon` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `accuracyRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkInRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cleanlinessRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communicationRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueRating` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_CategoryToListing" DROP CONSTRAINT "_CategoryToListing_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CategoryToListing" DROP CONSTRAINT "_CategoryToListing_B_fkey";

-- AlterTable
ALTER TABLE "Amenity" ADD COLUMN     "isGuestFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSafety" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStandOut" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "icon" SET NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "icon" SET NOT NULL;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "guestFavorite",
DROP COLUMN "photos",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "country_code" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "images" JSONB,
ADD COLUMN     "isGuestFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLastMinuteDiscount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isListed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMonthlyDiscount" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isNewListingDiscount" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isNoiseMonitor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSecurityCamera" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWeapons" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWeeklyDiscount" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastMinuteDiscount" INTEGER DEFAULT 0,
ADD COLUMN     "monthlyDiscount" INTEGER DEFAULT 25,
ADD COLUMN     "newListingDiscount" INTEGER DEFAULT 20,
ADD COLUMN     "privacyTypeId" TEXT,
ADD COLUMN     "securityCameraDescription" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "step" TEXT,
ADD COLUMN     "weekendPremium" INTEGER,
ADD COLUMN     "weeklyDiscount" INTEGER DEFAULT 12,
ALTER COLUMN "guestCount" SET DEFAULT 1,
ALTER COLUMN "bedCount" SET DEFAULT 1,
ALTER COLUMN "bathroomCount" SET DEFAULT 0.5,
ALTER COLUMN "bathroomCount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "accuracyRating" INTEGER NOT NULL,
ADD COLUMN     "averageRating" INTEGER NOT NULL,
ADD COLUMN     "checkInRating" INTEGER NOT NULL,
ADD COLUMN     "cleanlinessRating" INTEGER NOT NULL,
ADD COLUMN     "communicationRating" INTEGER NOT NULL,
ADD COLUMN     "helpfulCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "locationRating" INTEGER NOT NULL,
ADD COLUMN     "notHelpfulCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "valueRating" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."_CategoryToListing";

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "nights" INTEGER NOT NULL,
    "pricePerNight" INTEGER NOT NULL,
    "cleaningFee" INTEGER DEFAULT 0,
    "serviceFee" INTEGER DEFAULT 0,
    "taxes" INTEGER DEFAULT 0,
    "confirmationCode" TEXT,
    "specialRequests" TEXT,
    "guestPhoneNumber" TEXT,
    "estimatedCheckInTime" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" TEXT,
    "cancellationReason" TEXT,
    "refundAmount" INTEGER,
    "paymentIntentId" TEXT,
    "paymentMethod" TEXT,
    "hostPayout" INTEGER,
    "hostPayoutStatus" TEXT DEFAULT 'pending',
    "hostPayoutDate" TIMESTAMP(3),
    "isEligibleForReview" BOOLEAN NOT NULL DEFAULT false,
    "guestReviewedHost" BOOLEAN NOT NULL DEFAULT false,
    "hostReviewedGuest" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewHelpfulness" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isHelpful" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewHelpfulness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacyType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "icon" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivacyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isCoverPicture" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "order" INTEGER,
    "caption" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Wishlist',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL,
    "wishlistId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_confirmationCode_key" ON "Reservation"("confirmationCode");

-- CreateIndex
CREATE INDEX "Reservation_listingId_idx" ON "Reservation"("listingId");

-- CreateIndex
CREATE INDEX "Reservation_guestId_idx" ON "Reservation"("guestId");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");

-- CreateIndex
CREATE INDEX "Reservation_checkInDate_checkOutDate_idx" ON "Reservation"("checkInDate", "checkOutDate");

-- CreateIndex
CREATE INDEX "Reservation_confirmationCode_idx" ON "Reservation"("confirmationCode");

-- CreateIndex
CREATE INDEX "Reservation_paymentStatus_idx" ON "Reservation"("paymentStatus");

-- CreateIndex
CREATE INDEX "ReviewHelpfulness_reviewId_idx" ON "ReviewHelpfulness"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewHelpfulness_userId_idx" ON "ReviewHelpfulness"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewHelpfulness_reviewId_userId_key" ON "ReviewHelpfulness"("reviewId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivacyType_name_key" ON "PrivacyType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PrivacyType_slug_key" ON "PrivacyType"("slug");

-- CreateIndex
CREATE INDEX "Photo_listingId_order_idx" ON "Photo"("listingId", "order");

-- CreateIndex
CREATE INDEX "Photo_listingId_createdAt_idx" ON "Photo"("listingId", "createdAt");

-- CreateIndex
CREATE INDEX "Photo_listingId_isCoverPicture_idx" ON "Photo"("listingId", "isCoverPicture");

-- CreateIndex
CREATE INDEX "Photo_publicId_signature_idx" ON "Photo"("publicId", "signature");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_publicId_key" ON "Photo"("publicId");

-- CreateIndex
CREATE INDEX "Wishlist_userId_idx" ON "Wishlist"("userId");

-- CreateIndex
CREATE INDEX "WishlistItem_wishlistId_idx" ON "WishlistItem"("wishlistId");

-- CreateIndex
CREATE INDEX "WishlistItem_listingId_idx" ON "WishlistItem"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_wishlistId_listingId_key" ON "WishlistItem"("wishlistId", "listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_privacyTypeId_fkey" FOREIGN KEY ("privacyTypeId") REFERENCES "PrivacyType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHelpfulness" ADD CONSTRAINT "ReviewHelpfulness_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHelpfulness" ADD CONSTRAINT "ReviewHelpfulness_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
