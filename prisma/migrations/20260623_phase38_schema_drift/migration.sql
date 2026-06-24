-- DropIndex
DROP INDEX "WebhookEvent_payload_gin_idx";

-- AlterTable
ALTER TABLE "DeliveryLink" ADD COLUMN     "revokedByUserId" TEXT;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "bindingHash" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationExpiresAt" TIMESTAMP(3),
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "QaVerificationLedger" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "packageVersion" TEXT NOT NULL,
    "phase" INTEGER NOT NULL,
    "checkKey" TEXT NOT NULL,
    "layer" "QaTestLayer" NOT NULL,
    "status" "QaCheckStatus" NOT NULL,
    "severity" "QaSeverity" NOT NULL,
    "command" TEXT,
    "exitCode" INTEGER,
    "evidenceCount" INTEGER NOT NULL,
    "notes" TEXT,
    "accepted" BOOLEAN NOT NULL,
    "productionReleaseAllowed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QaVerificationLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyKey" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "resultStatus" INTEGER NOT NULL,
    "resultBody" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QaVerificationLedger_organizationId_packageVersion_phase_ch_idx" ON "QaVerificationLedger"("organizationId", "packageVersion", "phase", "checkKey");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyKey_idempotencyKey_key" ON "IdempotencyKey"("idempotencyKey");

-- CreateIndex
CREATE INDEX "IdempotencyKey_expiresAt_idx" ON "IdempotencyKey"("expiresAt");

-- CreateIndex
CREATE INDEX "IdempotencyKey_organizationId_createdAt_idx" ON "IdempotencyKey"("organizationId", "createdAt");
