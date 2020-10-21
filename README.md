# Attendance Reports using Zoom API
> This app is build over [Make Zoom API call using JWT](https://github.com/zoom/zoom-api-jwt).

> With this app, you can attendance reports for a users meetings between specific dates. Follow the steps below to install the app and run it on your computer.

## Getting Started

### Install

Clone the repo using git clone and restore the packages.
``` 
git clone https://github.com/KeremKoksal/zoom-api-attandance.git 
cd zoom-api-attandance
npm install
```

### Add Credentials to config.js

To generate JWT, you have to provide your API Key and API Secret credentials. You can locate these credentials in your app’s configuration by going to Zoom Marketplace > Manage > **YourApp** > App Credentials. If you haven’t already registered your app in the marketplace, you will have to create an app here to get your credentials. For the purpose of this sample app, you only need your credentials and you do not have to fill out any additional information while registering the app.

> Rename `config.js.example` to `config.js` In the config.js file, input your client API Key & Secret credentials.
``` 
	const config = {
	production:{	
		APIKey : 'Your environment API Key',
		APISecret : 'Your environment API Secret'
	}
    };
```
> Set your environment varaibles.
``` 
export NODE_NEV=[environment name] (e.g. export NODE_NEV=production) 
```
### Run the app

> Type `node index.js` in your terminal from within the project directory.
> Open your browser and connect to app. It's usually [http://localhost:3000](http://localhost:3000)
> Enter a users email and select dates. 

### Conclusion
> This app created for a quick solution. It is dirty. Response page is a simple table element which can be copied & pasted to excel or sheets. 

### For more Information about Zooms API and JWT

Documentation for JWT is available [here](https://marketplace.zoom.us/docs/guides/authorization/jwt). You can learn more about Zoom API [here](https://marketplace.zoom.us/docs/api-reference/introduction).
 



