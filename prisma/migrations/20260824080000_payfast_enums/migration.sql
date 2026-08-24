-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'awaiting_payment' BEFORE 'confirmed';

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'payment_required';
