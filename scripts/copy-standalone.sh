
cp package.json .next/standalone/
cp next.config.ts .next/standalone/
cp tsconfig.json .next/standalone/
cp postcss.config.mjs .next/standalone/
cp tailwind.config.js .next/standalone/

cp -r public .next/standalone/

cp -r prisma .next/standalone/

cp -r src .next/standalone/


echo "Archivos y carpetas necesarios copiados a .next/standalone"