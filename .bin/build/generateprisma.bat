@echo off

echo.
echo ==============================
echo generate:prisma
echo ==============================
echo.

cd ../
call pnpm "generate:prisma"

pause
