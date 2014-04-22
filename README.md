#Meteor.js on OpenShift, with custom version of NodeJS
Deploy [meteor.js](http://meteor.com/) application bundles on [OpenShift](http://openshift.com/)

This example uses a modified version of the Meteor example application (leaderboard) with a custom version of NodeJS ready for deploy to Openshift.  It is a modified version of the Vladka's project here - https://github.com/vladka/openshift-meteor-leaderboard-customNode

## Create a MongoDB Instance at MongoLab
1. Sign up for an account at [http://www.mongolab.com](http://www.mongolab.com). When successful, a database landing page with no databases displays.
2. Create a database. Be sure to specify a database user name and password. These credentials are **not** the same as your MongoLab account credentials.
3. Click on your database. The database landing page provides a mongodb URI connection string of the form:   
```
  mongodb://<user>:<password>@host.mongolab.com:12345/my-db-name
```
4. Copy this value somewhere helpful and replace placeholders with your database user credentials.

## Configure your OpenShift gear 
We will use a base NodeJS (node 0.6) cartridge. The name of our application in this example is "vote". 

     rhc app create vote nodejs-0.6 --from-code=https://github.com/ichristo/leaderboard-summit.git

The above command will output a local copy of your OpenShift application source in a folder matching your application name.  Be sure to run this command from within a folder where you would like to keep your project source.

## Create a MongoLab URL Env Variable
Fortunately, the rhc client allows you to configure your environment variable without placing credentials in a repository (see [Custom Environment Variables](https://www.openshift.com/blogs/new-online-features-for-september-2013) for more information). Use the following commands configure your production URI and restart your app.

```
    rhc env set MONGOLAB_URI='<db uri>' --app <app name>
    rhc app restart --app <app name>
```

The above command will create user environment variable with the MONGOLAB_URI value.  This is used by the meteorshim.js file to connect to the Mongo instances hosted by MongoLab.

That's it! Check out your new Meteor.js application at:

    http://vote-$yournamespace.rhcloud.com

## Change version of nodeJS
 Example above uses node version 0.10.24. 
 You can change it anywhere by changing file 
 on the path: 

    vote/.openshift/markers/NODEJS_VERSION 

then don't forgot to push changes to openshift 
   
    git add . 
    git commit -am "any message"
    git push


