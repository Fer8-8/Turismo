-- CreateTable
CREATE TABLE "cdm_address" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "alternative_phone" TEXT,
    "company" TEXT,
    "state_id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "label" TEXT NOT NULL,

    CONSTRAINT "cdm_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_state" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cdm_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_country" (
    "id" TEXT NOT NULL,
    "iso_name" TEXT NOT NULL,
    "iso" TEXT NOT NULL,
    "iso3" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numcode" INTEGER NOT NULL,
    "states_required" BOOLEAN NOT NULL DEFAULT false,
    "zipcode_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_country_pkey" PRIMARY KEY ("id")
);
