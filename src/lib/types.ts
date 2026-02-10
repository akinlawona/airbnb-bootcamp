import { Prisma } from "../../generated/prisma";

export type Review = {
  id: number;
  rating: number;
  comment: string;
};

export type Listing = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  hostType: string;
  listingType: string;
  guestFavorite?: boolean;
  reviews: Review[];
};

export type ListingWithAmenities = Prisma.ListingGetPayload<{
  include: {
    amenities: true;
  };
}>;

export type ListingWithPhotos = Prisma.ListingGetPayload<{
  include: {
    photos: true;
  };
}>;

export type ListingCardData = Prisma.ListingGetPayload<{
  include: {
    photos: {
      where: {
        isCoverPicture: true;
      };
      take: 1;
    };
    reviews: true;
    category: true;
    privacyType: true;
  };
}>;

export type Trips = Prisma.ReservationGetPayload<{
  include: {
    listing: {
      include: {
        photos: true;
        user: true;
      };
    };
  };
}>;

export type ListingWithRelations = Prisma.ListingGetPayload<{
  include: {
    photos: true;
    reviews: {
      include: {
        user: {
          select: {
            image: true;
            name: true;
            createdAt: true;
          };
        };
        helpfulness: {
          select: {
            isHelpful: true;
          };
        };
      };
    };
    amenities: true;
    category: true;
    privacyType: true;
    user: true;
    reservations: true;
  };
}>;

export type ReviewWithUserInfo = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        image: true;
        name: true;
        createdAt: true;
      };
    };
    helpfulness: {
      select: {
        isHelpful: true;
      };
    };
  };
}>;
export type ImageContentProps = {
  url: string;
  publicId: string;
  signature: string;
  thumbnail: string;
};

export type ImageFormValues = {
  images: ImageContentProps[];
};

export type WishlistWithItems = Prisma.WishlistGetPayload<{
  include: {
    items: {
      include: {
        listing: {
          include: {
            photos: {
              where: {
                isCoverPicture: true;
              };
              take: 1;
            };
            reviews: true;
          };
        };
      };
    };
  };
}>;
