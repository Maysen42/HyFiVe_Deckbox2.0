OUTPUT=hyfiveuser@hyfive.info:/home/hyfiveuser/configuration_interface

cp -r public .next/standalone
cp -r .next/static .next/standalone/.next
rsync -a .next/standalone/ $OUTPUT