-- Migration to make the worker column nullable in the employees table
-- This fixes the error when creating new employees without providing a worker value

ALTER TABLE employees ALTER COLUMN worker DROP NOT NULL;