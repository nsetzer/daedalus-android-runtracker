
SHELL := /bin/bash

.PHONY: build
build:
	source venv/bin/activate && python -V && \
		PYTHONPATH='./daedalus' \
		python -m daedalus build \
			--platform android \
			--static ./resources \
			./src/app.js \
			./app/src/main/assets/site

.PHONY: serve
serve:
	source venv/bin/activate && python -V && \
		PYTHONPATH='./daedalus' \
		python -m daedalus serve \
			--static ./resources \
			./src/app.js \

