-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dashboardCards" JSONB,
ADD COLUMN     "dashboardCharts" JSONB,
ALTER COLUMN "updatedAt" DROP DEFAULT;
