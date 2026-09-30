-- Reverse of migration.sql. Generated with:
--   npx prisma migrate diff --from-schema prisma/schema.prisma --to-empty --script

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_desk_id_fkey`;

-- DropTable
DROP TABLE `teams`;

-- DropTable
DROP TABLE `users`;

-- DropTable
DROP TABLE `desks`;

-- DropTable
DROP TABLE `rooms`;

-- DropTable
DROP TABLE `bookings`;

-- Clear the ledger entry so `prisma migrate deploy` re-applies this migration.
DELETE FROM `_prisma_migrations` WHERE `migration_name` = '20260930105731_init_users_and_bookings';
