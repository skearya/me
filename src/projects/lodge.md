# lodge

<img
	width="1336"
	alt="image"
	src="https://github.com/user-attachments/assets/134ba2d4-810c-46b0-aaf2-9b5ed497474b"
/>

---

very basic terminal chat server/client written in C

- tcp
- able to handle partial message reads
- server uses `epoll` to be able to scale connections
- client uses `poll`
- linux only

deps:

- [stb_ds.h](https://github.com/nothings/stb/blob/master/stb_ds.h): used on server for a hashmap to manage client data
