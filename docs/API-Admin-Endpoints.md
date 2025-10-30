## GET /api/healthz
A quick and easy endpoint for you to confirm the server status
If this endpoint receives a request it will not check or use any of the information sent 

Uses:

	- Confirms the server is online and ready for requests

Response:
```JSON
{
"ok"
}
```


## GET /admin/metrics
A basic HTML web page that displays server details via the browser like any normal site.

Uses: 
	- Web page that displays the number of users who have visited while the server is online

## POST /admin/reset
**WARNING**
This endpoint will remove all data stored in the database. 
This is used for resetting the database during testing and should be disabled in all other situations.

Uses: 
	- Will use the database URL from the config .env file to remove everything from the database
	- Will reset all metrics


