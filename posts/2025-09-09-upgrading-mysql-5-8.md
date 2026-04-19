---
title: Upgrading MySQL 5 - 8
date: 2025-09-09
draft: false
cover: /images/wizard3.png
aside: false
tags: [homelab, blog, mysql, ghost]
---

> “I gave you the chance of aiding me willingly, but you have elected the way of pain."

First, let me start by saying that I love [Ghost](https://ghost.org). While this site isn’t built on it since it doesn’t quite align with my goals here, Ghost has been a perfect fit for several other projects I’ve worked on. After running smoothly for over two years, I decided it was time to apply a major upgrade and take advantage of all the [new features](https://github.com/TryGhost/Ghost/releases) ghost has to offer.

However, there was a catch - my current database wasn’t supported, and as it turns out, upgrading from MySQL 5 to 8 can be tricky under certain circumstances.

My Ghost blog is running via [Docker](https://www.docker.com), and this setup may have complicated things when I followed [Ghost’s official upgrade documentation](https://ghost.org/docs/faq/supported-databases/). I encountered issues where the upgrade either failed outright or appeared to succeed but caused my site to run sluggishly.

After much trial and error, I finally figured out a solution, and I hope this guide helps anyone else facing the same challenges. Here’s what my docker-compose.yml file looked like before the upgrade:

```yaml
version: '3'
services:

  ghost:
    image: ghost:4.44
    restart: always
    depends_on:
      - db
    environment:
      url: example.com
      database__client: mysql
      database__connection__host: db
      database__connection__user: root
      database__connection__password: ${GHOST_DB_PASSWORD}
      database__connection__database: ghost
    volumes:
      - /opt/ghost_content:/var/lib/ghost/content

  db:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - /opt/ghost_mysql:/var/lib/mysql

  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    restart: always
    depends_on:
      - ghost
    ports:
      - "80:80"
      - "443:443"
    volumes:
       - /etc/letsencrypt/:/etc/letsencrypt/
       - /usr/share/nginx/html:/usr/share/nginx/html
```

The first thing I did was ensure I had a recent backup. Trust me, this process can fail, and you’ll be glad you have one.

While it might be tempting, simply changing the image versions:

```yaml
image: ghost:4.44
image: mysql:5.7
```

seemed too good to be true, and I can confirm that it’s not the solution.

What did work? After some trial and error, I found success by creating a backup of my existing database:

```bash
docker exec your-db-container mysqldump -u your-username -p your-database > /path/to/backup.sql
```

Next, I spun up a version of MySQL 8 alongside my existing services:

```yaml
version: '3'
services:

  ghost:
    image: ghost:5.82.11
    restart: always
    depends_on:
      - db
    environment:
      url: example.com
      database__client: mysql
      database__connection__host: db2
      database__connection__user: root
      database__connection__password: ${GHOST_DB_PASSWORD}
      database__connection__database: ghost
    volumes:
      - /opt/ghost_content:/var/lib/ghost/content

  db:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - /opt/ghost_mysql:/var/lib/mysql

  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    restart: always
    depends_on:
      - ghost
    ports:
      - "80:80"
      - "443:443"
    volumes:
       - /etc/letsencrypt/:/etc/letsencrypt/
       - /usr/share/nginx/html:/usr/share/nginx/html

  db2:
    image: mysql:8
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - /opt/ghost_mysql_new:/var/lib/mysql
```

Then, I loaded the backup into the new MySQL 8 container:

```bash
docker exec -i new-db-container mysql -u youruser -p your-database < /backup.sql
```

Once that was done, I switched my Ghost container to use the new database:

```yaml
ghost:
    image: ghost:5.82.11
    restart: always
    depends_on:
      - db2
```

After confirming everything was working smoothly, I updated Ghost to the latest version:

```yaml
ghost:
    image: ghost:latest
```

This solved the issue entirely. At this point, I no longer needed the old database, so I shut it down.

While this isn’t a comprehensive guide, I hope it helps if you find yourself in a similar situation.

::: herebot Hi, I'm the here-bot cat!
Use me to find your way in my website.

**Here I am:**
`/posts/2025-09-09-upgrading-mysql-5-8.md`

Click [Here](/) to go home.
:::
