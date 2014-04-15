#Meteor.js on OpenShift, with custom version of NodeJS
Deploy [meteor.js](http://meteor.com/) application bundles on [OpenShift](http://openshift.com/)

This example uses a modified version of the Meteor example application (leaderboard) with a custom version of NodeJS ready for deploy to Openshift.

## Create a MongoDB Instance at MongoLab
1. Sign up for an account at [http://www.mongolab.com](http://www.mongolab.com). When successful, a database landing page with no databases displays.
2. Create a database. Be sure to specify a database user name and password. These credentials are **not** the same as your MongoLab account credentials.
3. Click on your database. The database landing page provides a mongodb URI connection string of the form:   
```
  mongodb://<user>:<password>@host.mongolab.com:12345/my-db-name
```
4. Copy this value somewhere helpful and replace placeholders with your database user credentials.

## Configure your OpenShift gear 
We will use a base NodeJS (node 0.10) cartridge. The name of our application in this example is "myapp". 

     rhc app create myapp nodejs-0.6 --from-code=https://github.com/ichristo/leaderboard-summit.git
     #see quota:
     rhc show-app myapp --gears quota

## Create a MongoLab URL Env Variable
Fortunately, the rhc client allows you to configure your environment variable without placing credentials in a repository (see [Custom Environment Variables](https://www.openshift.com/blogs/new-online-features-for-september-2013) for more information). Use the following commands configure your production URI and restart your app.

```
    rhc env set MONGOLAB_URI='<db uri>' --app <app name>
    rhc app restart --app <app name>
```
    
The above command will output a local copy of your OpenShift application source in a folder matching your application name.  Be sure to run this command from within a folder where you would like to keep your project source.

That's it! Check out your new Meteor.js application at:

    http://myapp-$yournamespace.rhcloud.com

## Change version of nodeJS
 Example above uses node version 0.10.24. 
 You can change it anywhere by changing file 
 on the path: 

    myapp/.openshift/markers/NODEJS_VERSION 

then don't forgot to push changes to openshift 
   
    git add . 
    git commit -am "any message"
    git push

## Switch from 'Demo app (leaderboard) to your real application'

    In my case :
    1) I have used 'demeteorizer' (see article http://blog.modulus.io/demeteorizer)
    2) then I have copied 'demeteorized' content to myapp, except file package.json.
    3) Package.json file I have manually "merged" (there are dependencies, which you must keep from your application)
    4) git add, commit, push
    5) see your output: 
    
    rhc tail myapp

    6) if you see errors, if some dependency is missing: 
      add it to 'Package.json' and go to step 4)

