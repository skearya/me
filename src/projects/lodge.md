basic terminal chat server/client written in C

### info

- tcp
- able to handle partial message reads
- server uses `epoll` to be able to scale connections
- client uses `poll`
- linux only

### dependencies

- [stb_ds.h](https://github.com/nothings/stb/blob/master/stb_ds.h): used on server for a hashmap to manage client data
