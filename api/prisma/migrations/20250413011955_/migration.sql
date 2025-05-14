-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
