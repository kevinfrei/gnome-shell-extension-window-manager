
schemas:
	glib-compile-schemas windowManager@kevinfrei@hotmail.com/schemas/

submit: schemas
	cd windowManager@kevinfrei@hotmail.com/ && zip -r ~/windowManager.zip *

install:
	rm -rf ~/.local/share/gnome-shell/extensions/windowManager@kevinfrei@hotmail.com
	cp -r windowManager@kevinfrei@hotmail.com ~/.local/share/gnome-shell/extensions/

