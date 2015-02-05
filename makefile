db:
	echo --- seeding initial data ---
	./db/userdata.sh
	./db/spider.sh

.PHONY: db